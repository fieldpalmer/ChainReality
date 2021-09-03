import React, { Ref, useCallback, useEffect, useState } from 'react';
import { Image } from 'antd';
import { MetadataCategory, MetadataFile } from '@oyster/common';
import { MeshViewer } from '../MeshViewer';
import { ThreeDots } from '../MyLoader';
import { useCachedImage, useExtendedArt, useCachedText } from '../../hooks';
import { Stream, StreamPlayerApi } from '@cloudflare/stream-react';
import { PublicKey } from '@solana/web3.js';
import { getLast } from '../../utils/utils';
import { pubkeyToString } from '../../utils/pubkeyToString';
import InnerHTML from 'dangerously-set-html-content';

const MeshArtContent = ({
  uri,
  animationUrl,
  className,
  style,
  files,
}: {
  uri?: string;
  animationUrl?: string;
  className?: string;
  style?: React.CSSProperties;
  files?: (MetadataFile | string)[];
}) => {
  const renderURL =
    files && files.length > 0 && typeof files[0] === 'string'
      ? files[0]
      : animationUrl;
  const { isLoading } = useCachedImage(renderURL || '', true);

  if (isLoading) {
    return (
      <CachedImageContent
        uri={uri}
        className={className}
        preview={false}
        style={{ width: 300, ...style }}
      />
    );
  }

  return <MeshViewer url={renderURL} className={className} style={style} />;
};

const CachedImageContent = ({
  uri,
  className,
  preview,
  style,
}: {
  uri?: string;
  className?: string;
  preview?: boolean;
  style?: React.CSSProperties;
}) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const { cachedBlob } = useCachedImage(uri || '');

  return (
    <Image
      src={cachedBlob}
      preview={preview}
      wrapperClassName={className}
      loading="lazy"
      wrapperStyle={{ ...style }}
      onLoad={e => {
        setLoaded(true);
      }}
      placeholder={<ThreeDots />}
      {...(loaded ? {} : { height: 200 })}
    />
  );
};

const VideoArtContent = ({
  className,
  style,
  files,
  uri,
  animationURL,
  active,
}: {
  className?: string;
  style?: React.CSSProperties;
  files?: (MetadataFile | string)[];
  uri?: string;
  animationURL?: string;
  active?: boolean;
}) => {
  const [playerApi, setPlayerApi] = useState<StreamPlayerApi>();

  const playerRef = useCallback(
    ref => {
      setPlayerApi(ref);
    },
    [setPlayerApi],
  );

  useEffect(() => {
    if (playerApi) {
      playerApi.currentTime = 0;
    }
  }, [active, playerApi]);

  const likelyVideo = (files || []).filter((f, index, arr) => {
    if (typeof f !== 'string') {
      return false;
    }

    // TODO: filter by fileType
    return arr.length >= 2 ? index === 1 : index === 0;
  })?.[0] as string;

  const content =
    likelyVideo &&
    likelyVideo.startsWith('https://watch.videodelivery.net/') ? (
      <div className={`${className} square`}>
        <Stream
          streamRef={(e: any) => playerRef(e)}
          src={likelyVideo.replace('https://watch.videodelivery.net/', '')}
          loop={true}
          height={600}
          width={600}
          controls={false}
          videoDimensions={{
            videoHeight: 700,
            videoWidth: 400,
          }}
          autoplay={true}
          muted={true}
        />
      </div>
    ) : (
      <video
        className={className}
        playsInline={true}
        autoPlay={true}
        muted={true}
        controls={true}
        controlsList="nodownload"
        style={style}
        loop={true}
        poster={uri}
      >
        {likelyVideo && (
          <source src={likelyVideo} type="video/mp4" style={style} />
        )}
        {animationURL && (
          <source src={animationURL} type="video/mp4" style={style} />
        )}
        {files
          ?.filter(f => typeof f !== 'string')
          .map((f: any) => (
            <source src={f.uri} type={f.type} style={style} />
          ))}
      </video>
    );

  return content;
};

// async function getData(): Promise<any> {
//   return new Promise((resolve, reject) => {
//     fetch('https://www.arweave.net/-CAhQVYYNBNXXtaE1IanPcScye78Gkjj_iL6axQ9br8?ext=html')
//      .then(response => {
//        return response.text();
//       }).then(data_from_fetched => {
         
//          resolve(data_from_fetched);
//    }
// )    
// })}

// export async function http(
//   request
// ): Promise<any> {
//   const response = await fetch(request);
//   const body = await response.text();
//   return body;
// }

// const fetchAndTransformPost = async () => {
//   const response = await fetch("https://www.arweave.net/-CAhQVYYNBNXXtaE1IanPcScye78Gkjj_iL6axQ9br8?ext=html");
//   const post = await response.text();
//   return post;
// };


const ScriptArtContent = ({
  className,
  style,
  files,
  uri,
  animationURL,
  active,
}: {
  className?: string;
  style?: React.CSSProperties;
  files?: (MetadataFile | string)[];
  uri?: string;
  animationURL?: string;
  active?: boolean;
}) => {
  // console.log({animationURL});
  // console.log('checkpoint0')
  // let htmlbody='';
  // let flag=1;
  const { result } = useCachedText(animationURL|| '');
  // const util=require('util')
  // const res=http('https://www.arweave.net/QMEOQj8UKCsiBdAc1XuDwlevg9J_aRT5Ki40ADbfeVY?ext=html').then(data => {
  //   htmlbody = data
  //   //console.log('checkpoint5 ' + htmlbody) 
  //   console.log('checkpoint5 ')
  //   console.log()  
  //   let state = util.inspect(res);
  //   console.log(state);
  //   flag=0;
  // });

  // for (var i = 0; i >=0 ; i++) {

  //   if (flag===0) {
  //     break;
  //   }
  // }
  //htmlbody=await http('https://www.arweave.net/QMEOQj8UKCsiBdAc1XuDwlevg9J_aRT5Ki40ADbfeVY?ext=html');

  // const response = async (): Promise<string>  => { 
    
  //   return await fetch('https://www.arweave.net/-CAhQVYYNBNXXtaE1IanPcScye78Gkjj_iL6axQ9br8?ext=html')
  //     .then((response) => {
  //       const body=response.text();
  //       // console.log('checkpoint1')
  //       // console.log({body})
  //       return body})
  //     .then((response) => {
  //       // now fetch the text
  //       // console.log('checkpoint3 ' + response) 
  //       return response
  //     })
    
  //   }
      
  // console.log(response)
  // response().then((r)=> htmlbody=r)
  //console.log('checkpoint4 ' + result)    
  const content = <div> <InnerHTML html={String(result)}/> </div>

  // console.log('checkpoint4')



  // return result===undefined? null : result;
  return content
};

export const ArtContent = ({
  category,
  className,
  preview,
  style,
  active,
  allowMeshRender,
  pubkey,

  uri,
  animationURL,
  files,
}: {
  category?: MetadataCategory;
  className?: string;
  preview?: boolean;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
  ref?: Ref<HTMLDivElement>;
  active?: boolean;
  allowMeshRender?: boolean;
  pubkey?: PublicKey | string;
  uri?: string;
  animationURL?: string;
  files?: (MetadataFile | string)[];
}) => {
  const id = pubkeyToString(pubkey);

  const { ref, data } = useExtendedArt(id);

  if (pubkey && data) {
    uri = data.image;
    animationURL = data.animation_url;
  }

  if (pubkey && data?.properties) {
    files = data.properties.files;
    category = data.properties.category;
  }

  animationURL = animationURL || '';

  const animationUrlExt = new URLSearchParams(
    getLast(animationURL.split('?')),
  ).get('ext');

  if (
    allowMeshRender &&
    (category === 'vr' ||
      animationUrlExt === 'glb' ||
      animationUrlExt === 'gltf')
  ) {
    return (
      <MeshArtContent
        uri={uri}
        animationUrl={animationURL}
        className={className}
        style={style}
        files={files}
      />
    );
  }
  let content;

  if (category === 'video'){
    content=<VideoArtContent
      className={className}
      style={style}
      files={files}
      uri={uri}
      animationURL={animationURL}
      active={active}
    />
    } 
  else if (category === 'script'){
    content=<ScriptArtContent
      className={className}
      style={style}
      files={files}
      uri={uri}
      animationURL={animationURL}
      active={active}
    />
  }
  else{
    content=<CachedImageContent
      uri={uri}
      className={className}
      preview={preview}
      style={style}
    />
  }
  return (
    <div
      ref={ref as any}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {content}
    </div>
  );
};