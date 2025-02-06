export function DefaultFooter() {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <footer className="w-full bg-black text-[#d0d5dd] min-h-[125px] py-6">
      <div className="container mx-auto px-3 w-full">
        <div className="flex flex-col justify-between gap-4 h-full w-full">
          <div className="flex flex-col lg:flex-row flex-wrap gap-x-6 gap-y-2 text-base w-full">
            <a href="" className="text-[#d0d5dd] hover:text-[#f7f7f9]">
              Report Vulnerability
            </a>
            <a href="" className="text-[#d0d5dd] hover:text-[#f7f7f9]">
              Privacy Statement
            </a>
            <a href="" className="text-[#d0d5dd] hover:text-[#f7f7f9]">
              Terms of use
            </a>
            <a href="" className="text-[#d0d5dd] hover:text-[#f7f7f9]">
              Contact us
            </a>
          </div>
          <div className="text-[16px] w-full text-left lg:text-right text-[#f7f7f9]">
            © 2025 Government of Singapore. Last updated {formattedDate}.
          </div>
        </div>
      </div>
    </footer>
  );
}
