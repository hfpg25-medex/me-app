import {Footer} from "@govtechsg/sgds-react";
import {BRAND_NAME, ORGANISATION_NAME} from "../../lib/config";

export function DefaultFooter() {
  return (
    <Footer>
      {/* <Footer.Top>
        <h1>{ORGANISATION_NAME}</h1>
        <Footer.Top.Header>
          {ORGANISATION_NAME} serves citizens and business by being a constant partner in government to support both parties needs.
        </Footer.Top.Header>
        <Footer.Top.ContactLinks>
          <a href="" target="_blank">
            Contact
          </a>
          <a href="" target="_blank">
            Feedback
          </a>
        </Footer.Top.ContactLinks>
      </Footer.Top> */}
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