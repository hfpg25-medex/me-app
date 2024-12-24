import {Footer} from "@govtechsg/sgds-react";

export function DefaultFooter() {
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
          © 2025 Government of Singapore. Last updated 23 December 2024.
        </Footer.Bottom.Copyrights>
      </Footer.Bottom>
    </Footer>
  )
}