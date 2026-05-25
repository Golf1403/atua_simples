import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';

const Help = (): JSX.Element => {
  const externalUrl = 'https://ajudaseicalculos.bitrix24.site/'; // Replace this with your desired external URL

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleAnchorClick = (event: Event) => {
    event.preventDefault(); // Prevent default link behavior (opening in the iframe)
    const target = event.target as HTMLAnchorElement;
    const href = target.getAttribute('href');
    if (href) {
      // Handle the link URL as needed in your React component
    }
  };

  useEffect(() => {
    // const getPage = async () => {
    //   const document = await axios.get('https://ajudaseicalculos.bitrix24.site');
    // };
    // getPage();
  }, []);

  return (
    <section>
      <iframe
        ref={iframeRef}
        style={{ textDecoration: 'none', height: '100%', width: '100%' }}
        src={externalUrl}></iframe>
      ;
    </section>
  );
};

export default Help;
