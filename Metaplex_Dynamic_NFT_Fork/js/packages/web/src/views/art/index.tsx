import React from 'react';
import { Row, Col, Divider, Layout, Tag, Button, Skeleton, List, Card } from 'antd';
import { useParams } from 'react-router-dom';
import { useArt, useExtendedArt } from './../../hooks';

import { ArtContent } from '../../components/ArtContent';
import { shortenAddress, useConnection, Data} from '@oyster/common';
import { useWallet } from '@solana/wallet-adapter-react';
import { MetaAvatar } from '../../components/MetaAvatar';
import { sendSignMetadata } from '../../actions/sendSignMetadata';
import { sendUpdateMetadataConditional } from '../../actions/sendUpdateMetadataConditional';
import { ViewOn } from './../../components/ViewOn';
import { ArtType } from '../../types';
import { useRef, useEffect } from 'react';

const { Content } = Layout;

export const ArtView = () => {

  const { id } = useParams<{ id: string }>();
  const wallet = useWallet();

  const connection = useConnection();
  const art = useArt(id);
  const mintKey=art.mint || '';
  let badge = '';
  if (art.type === ArtType.NFT) {
    badge = 'Unique';
  } else if (art.type === ArtType.Master) {
    badge = 'NFT 0';
  } else if (art.type === ArtType.Print) {
    badge = `${art.edition} of ${art.supply}`;
  }
  const { ref, data } = useExtendedArt(id);

  // const { userAccounts } = useUserAccounts();

  // const accountByMint = userAccounts.reduce((prev, acc) => {
  //   prev.set(acc.info.mint.toBase58(), acc);
  //   return prev;
  // }, new Map<string, TokenAccount>());

  const description = data?.description;
  const attributes = data?.attributes;

  //Get image evolution inputs from creater either at creation of NFT or through API call at evolution.
  //Get the current conditions from user and check in on chain program if these are satisfied or not.

  // const ivysaur="https://www.arweave.net/yJCBxnySySeKAhT_Tp2HPaG_sXf4PHTgFC7uElnYPRM?ext=png";
  // const condition_ivy = 1;
  const venasaur="https://www.arweave.net/f1A3B77RjQQKD0AQZQYP2wm0mbNziPxlO3EcZ1ENN04?ext=png";
  const condition_vena = 2;

  const uri=venasaur;
  const condition=condition_vena;

  // const uri=ivysaur;
  // const condition=condition_ivy;

  const name= data?.name || '';

  const tag = (
    <div className="info-header">
      <Tag color="blue">UNVERIFIED</Tag>
    </div>
  );

  const unverified = (
    <>
      {tag}
      <div style={{ fontSize: 12 }}>
        <i>
          This artwork is still missing verification from{' '}
          {art.creators?.filter(c => !c.verified).length} contributors before it
          can be considered verified and sellable on the platform.
        </i>
      </div>
      <br />
    </>
  );

  return (
    <Content>
      <Col>
        <Row ref={ref}>
          <Col xs={{ span: 24 }} md={{ span: 12 }} style={{ padding: '30px' }}>
            <ArtContent
              style={{ width: 300 }}
              height={300}
              width={300}
              className="artwork-image"
              pubkey={id}
              active={true}
              allowMeshRender={true}
            />
            {/* <img style={{ width: 300 }}
              height={300}
              width={300} src={art.uri}></img> */}
          </Col>
          {/* <Divider /> */}
          <Col
            xs={{ span: 24 }}
            md={{ span: 12 }}
            style={{ textAlign: 'left', fontSize: '1.4rem' }}
          >
            <Row>
              <div style={{ fontWeight: 700, fontSize: '4rem' }}>
                {art.title || <Skeleton paragraph={{ rows: 0 }} />}
              </div>
            </Row>
            <Button
                  onClick={async () => {
                    try {
                      await sendUpdateMetadataConditional(
                        connection,
                        wallet,
                        id,
                        uri,
                        mintKey,
                        condition,
                        name,
                      )
                    } catch (e) {
                      console.error(e);
                      return false;
                    }
                    return true;
                  }}>
                  Evolve NFT
                </Button>
            <Row>
              <Col span={6}>
                <h6>Royalties</h6>
                <div className="royalties">
                  {((art.seller_fee_basis_points || 0) / 100).toFixed(2)}%
                </div>
              </Col>
              <Col span={12}>
                <ViewOn id={id} />
              </Col>
            </Row>
            <Row>
              <Col>
                <h6 style={{ marginTop: 5 }}>Created By</h6>
                <div className="creators">
                  {(art.creators || []).map((creator, idx) => {
                    return (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: 5,
                        }}
                      >
                        <MetaAvatar creators={[creator]} size={64} />
                        <div>
                          <span className="creator-name">
                            {creator.name ||
                              shortenAddress(creator.address || '')}
                          </span>
                          <div style={{ marginLeft: 10 }}>
                            {!creator.verified &&
                              (creator.address === pubkey ? (
                                <Button
                                  onClick={async () => {
                                    try {
                                      await sendSignMetadata(
                                        connection,
                                        wallet,
                                        id,
                                      );
                                    } catch (e) {
                                      console.error(e);
                                      return false;
                                    }
                                    return true;
                                  }}
                                >
                                  Approve
                                </Button>
                              ) : (
                                tag
                              ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <h6 style={{ marginTop: 5 }}>Edition</h6>
                <div className="art-edition">{badge}</div>
              </Col>
            </Row>

            {/* <Button
                  onClick={async () => {
                    if(!art.mint) {
                      return;
                    }
                    const mint = new PublicKey(art.mint);

                    const account = accountByMint.get(art.mint);
                    if(!account) {
                      return;
                    }

                    const owner = wallet.publicKey;

                    if(!owner) {
                      return;
                    }
                    const instructions: any[] = [];
                    await updateMetadata(undefined, undefined, true, mint, owner, instructions)

                    sendTransaction(connection, wallet, instructions, [], true);
                  }}
                >
                  Mark as Sold
                </Button> */}
          </Col>
          <Col span="12">
            <Divider />
            {art.creators?.find(c => !c.verified) && unverified}
            <br />
            <div className="info-header">ABOUT THE CREATION</div>
            <div className="info-content">{description}</div>
            <br />
            {/*
              TODO: add info about artist


            <div className="info-header">ABOUT THE CREATOR</div>
            <div className="info-content">{art.about}</div> */}
          </Col>
          <Col span="12">
            {attributes &&
              <>
                <Divider />
                <br />
                <div className="info-header">Attributes</div>
                <List
                  size="large"
                  grid={{ column: 4 }}
                >
                  {attributes.map(attribute =>
                    <List.Item>
                      <Card title={attribute.trait_type}>{attribute.value}</Card>
                    </List.Item>
                  )}
                </List>
              </>
            }
          </Col>
        </Row>
      </Col>
    </Content>
  );
};
