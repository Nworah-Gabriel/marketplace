extern crate std;

use ed25519_dalek::{Signer, SigningKey};
use soroban_sdk::{testutils::Address as _, testutils::Ledger as _, Address, BytesN, Env, String};

use crate::{DataKey, LazyMint721, LazyMint721Client, MintVoucher};

fn jump_ledger(env: &Env, delta: u32) {
    env.ledger().with_mut(|li| {
        li.sequence_number += delta;
    });
}

fn setup() -> (
    Env,
    LazyMint721Client<'static>,
    Address,    /*contract_id*/
    SigningKey, /*creator_signing_key*/
) {
    let env = Env::default();
    env.ledger().with_mut(|li| li.sequence_number = 1);
    env.mock_all_auths();

    let contract_id = env.register(LazyMint721, ());
    let client = LazyMint721Client::new(&env, &contract_id);

    // Fixed signing key so we can generate valid voucher signatures in tests.
    let secret_key: ed25519_dalek::SecretKey = [7u8; 32];
    let signing_key = SigningKey::from_bytes(&secret_key);
    let creator_pubkey_bytes = signing_key.verifying_key().to_bytes();
    let creator_pubkey = BytesN::<32>::from_array(&env, &creator_pubkey_bytes);

    let creator = Address::generate(&env);
    client.initialize(
        &creator,
        &creator_pubkey,
        &String::from_str(&env, "LazyMint721 Test"),
        &String::from_str(&env, "L721"),
        &1_000u64,
        &500u32,
        &Address::generate(&env),
    );

    (env, client, contract_id, signing_key)
}

fn sign_voucher(
    env: &Env,
    contract_id: &Address,
    signing_key: &SigningKey,
    voucher: &MintVoucher,
) -> BytesN<64> {
    // Compute exactly the same digest that redeem() uses (binds to contract address).
    let digest = env.as_contract(contract_id, || LazyMint721::_voucher_digest(env, voucher));
    let mut msg = [0u8; 32];
    digest.copy_into_slice(&mut msg);

    let sig = signing_key.try_sign(&msg).unwrap();
    let sig_bytes = sig.to_bytes();
    BytesN::<64>::from_array(env, &sig_bytes)
}

#[test]
fn instance_ttl_is_extended_on_redeem() {
    let (env, client, contract_id, signing_key) = setup();

    let buyer = Address::generate(&env);

    // After init, bump ledgers past the threshold so instance data would expire
    // unless redeem() extends it at the start.
    jump_ledger(&env, 60_000);

    let currency_1 = Address::generate(&env);
    let voucher_1 = MintVoucher {
        token_id: 1,
        price: 0,
        currency: currency_1,
        uri: String::from_str(&env, "ipfs://token-1"),
        uri_hash: BytesN::from_array(&env, &[1u8; 32]),
        valid_until: 0,
    };
    let sig_1 = sign_voucher(&env, &contract_id, &signing_key, &voucher_1);
    let minted_1 = client.redeem(&buyer, &voucher_1, &sig_1);

    jump_ledger(&env, 60_000);

    let currency_2 = Address::generate(&env);
    let voucher_2 = MintVoucher {
        token_id: 2,
        price: 0,
        currency: currency_2,
        uri: String::from_str(&env, "ipfs://token-2"),
        uri_hash: BytesN::from_array(&env, &[2u8; 32]),
        valid_until: 0,
    };
    let sig_2 = sign_voucher(&env, &contract_id, &signing_key, &voucher_2);
    let minted_2 = client.redeem(&buyer, &voucher_2, &sig_2);

    assert_eq!(minted_1, 1u64);
    assert_eq!(minted_2, 2u64);
}

#[test]
fn persistent_ttl_is_extended_on_transfer_updated_owner_and_balance() {
    let (env, client, contract_id, signing_key) = setup();

    let buyer = Address::generate(&env);
    let bob = Address::generate(&env);

    let currency = Address::generate(&env);
    let voucher = MintVoucher {
        token_id: 1,
        price: 0,
        currency,
        uri: String::from_str(&env, "ipfs://token-1"),
        uri_hash: BytesN::from_array(&env, &[3u8; 32]),
        valid_until: 0,
    };
    let sig = sign_voucher(&env, &contract_id, &signing_key, &voucher);

    client.redeem(&buyer, &voucher, &sig);
    client.transfer(&buyer, &bob, &voucher.token_id);

    jump_ledger(&env, 60_000);

    let (owner_has, buyer_balance_has) = env.as_contract(&contract_id, || {
        let owner_has = env
            .storage()
            .persistent()
            .has(&DataKey::Owner(voucher.token_id));
        let buyer_balance_has = env
            .storage()
            .persistent()
            .has(&DataKey::BalanceOf(buyer.clone()));
        (owner_has, buyer_balance_has)
    });

    assert!(owner_has);
    assert!(buyer_balance_has);
    assert_eq!(client.owner_of(&voucher.token_id), bob);
}
