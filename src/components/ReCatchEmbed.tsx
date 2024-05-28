// components/ReCatchEmbed.tsx
import React, { useEffect } from 'react';

const ReCatchEmbed = () => {
  useEffect(() => {
    const embedScript = (r: Document, e: string, c: string, a: any[], t: string, ch: string) => {
      const h = r.getElementsByTagName(e)[0];
      const i = r.createElement(c) as HTMLScriptElement;
      i.async = true;
      i.id = 'recatch-embed-script';
      i.src = `https://cdn.recatch.cc/recatch-embed.iife.js?t=${a[0]}&b=${a[1]}&c=${t}&tr=true&th=${ch}`;
      h.appendChild(i);
    };

    embedScript(document, 'head', 'script', ['jazaa', 'utxnirulve'], 'jazaa-onboarding', 'dark');
  }, []);

  return (
    <div id="recatch-form-container">
      {/* The Re:catch form will be rendered here */}
    </div>
  );
};

export default ReCatchEmbed;
