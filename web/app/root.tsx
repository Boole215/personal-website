import { cssBundleHref } from "@remix-run/css-bundle";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import type { LinksFunction } from "@remix-run/node";
import { Navbar } from "components/Navbar/Navbar";
import "styles.css"

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export async function loader() {
  return {
    ENV: {},
  };
}

export default function App() { 
  const data = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" /> 
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta /> 
        <Links />
      </head>
	  <body style={{maxWidth:"650px", margin: "auto"}}>
	  <Navbar/>
          <Outlet />
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV=${JSON.stringify(data.ENV)}`,
          }}
        />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
