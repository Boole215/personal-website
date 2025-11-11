import { Link } from "@remix-run/react";
const linkBarStyle: React.CSSProperties = {
  width: "100%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
    gap: "10px",
};


export function Navbar() {
  return (
    <div style={linkBarStyle}>
	  <Link to="/"> Home </Link>
	      <a href="https://www.linkedin.com/in/jaortegar/"> LinkedIn</a>
	      <a href="https://github.com/Boole215" > Github</a>
	      <a href="mailto: jortega-rios@outlook.com" > Contact </a>
	  </div>
  );
}
