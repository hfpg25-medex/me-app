import {Footer} from "@govtechsg/sgds-react";

export function DefaultFooter() {

  const today = new Date();

  const formattedDate = today.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <Footer>
      <Footer.Bottom>
        <Footer.Bottom.Links>
          <a href="">
            Report Vulnerability
          </a>
          <a href="">Privacy Statement</a>
          <a href="">Terms of use</a>
          <a href="">Contact us</a>
        </Footer.Bottom.Links>
        <Footer.Bottom.Copyrights className="text-end">
          © 2025 Government of Singapore. Last updated {formattedDate}.
        </Footer.Bottom.Copyrights>
      </Footer.Bottom>
    </Footer>
  )
}