import { Keypair, Connection, TransactionInstruction } from '@solana/web3.js';
import {
  sendTransactionWithRetry,
  signMetadata,
  StringPublicKey,
  WalletSigner,
  updateMetadataConditional,
  Creator,
  Data,
  getUpdatableEdition,
  getEdition,
  getMintInfo,
  toPublicKey,
  getMetadata,
} from '@oyster/common';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';

import { MintLayout, Token } from '@solana/spl-token';

export async function sendUpdateMetadataConditional(
  connection: Connection,
  wallet: WalletSigner,
  metadata: StringPublicKey,
  uri: string,
  mintKey: string,
  condition: number,
  name: string,
) {
  if (!wallet.publicKey) throw new WalletNotConnectedError();

  let signers: Keypair[] = [];
  let instructions: TransactionInstruction[] = [];
  const updateAuthority: StringPublicKey = await getUpdatableEdition(mintKey);
  const updateAuthorityOld: StringPublicKey = await getEdition(mintKey);
  const mintinfo: any = await getMintInfo(connection,toPublicKey(mintKey));
  const metadatadata: any = await getMetadata(mintKey);
  console.log({updateAuthority},{updateAuthorityOld},{mintKey},{metadata},{mintinfo},{metadatadata});
  console.log({name});
  await updateMetadataConditional(
    condition,
    undefined,
    undefined,
    undefined,
    mintKey,
    String(wallet.publicKey),
    updateAuthority,
    instructions,
    uri,
    metadata,
  );

  await sendTransactionWithRetry(
    connection,
    wallet,
    instructions,
    signers,
    'single'
  );
}
