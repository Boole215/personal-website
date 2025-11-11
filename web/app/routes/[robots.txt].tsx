export const loader = () => {
    const robotText = `
    User-agent: *
    Allow: /

    Sitemap: http://jshoukai.com/sitemap.xml
   `

    return new Response(robotText, {
	status: 200,
	headers: {
	    "Content-Type": "text/plain"
	    
	},
    });
};
