import Script from "next/script";
import { Fragment } from "react";

export default function GoogleTag() {
  return (
    <>
      <Fragment>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-4Y1845DWJ7" />
        <Script
          id="gtag-init"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-4Y1845DWJ7');`,
          }}
        />
      </Fragment>
    </>
  );
}
