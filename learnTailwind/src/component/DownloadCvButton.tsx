import { PDFDownloadLink } from "@react-pdf/renderer";
import { CvDocument } from "./CvPdf";
import { personalInfo } from "../data/cv";

interface Props {
  readonly className?: string;
  readonly label?: string;
}

function DownloadCvButton({ className, label = "↓ Download CV" }: Props) {
  const fileName = `CV_${personalInfo.name.replace(/\s+/g, "_")}.pdf`;

  return (
    <PDFDownloadLink document={<CvDocument />} fileName={fileName}>
      {({ loading }) => (
        <button
          disabled={loading}
          className={
            className ??
            "flex items-center gap-1.5 px-4 py-2 border border-teal-500/40 text-teal-600 dark:text-teal-400 text-sm font-medium rounded-lg hover:bg-teal-500/10 hover:border-teal-500 transition-all duration-200 disabled:opacity-50"
          }
        >
          {loading ? (
            <>
              <span
                className="w-3.5 h-3.5 border-2 border-teal-500/40 border-t-teal-500 rounded-full animate-spin"
                aria-hidden="true"
              />{" "}
              Building…
            </>
          ) : (
            label
          )}
        </button>
      )}
    </PDFDownloadLink>
  );
}

export default DownloadCvButton;
