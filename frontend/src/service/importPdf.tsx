import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  PDF,
  PDFOrientationOption,
  PDFSizeOption,
  PDFUnitOption,
} from "./model/pdf";
import * as _ from "lodash";

interface PdfProps {
  items: any[];
  visibleColumn?: any[];
  pdfConfig?: PDF;
}
const exportPDF = (props: PdfProps) => {
  const unit = props.pdfConfig ? props.pdfConfig.unit : PDFUnitOption.PT;
  const size = props.pdfConfig ? props.pdfConfig.size : PDFSizeOption.A4;
  const orientation = props.pdfConfig
    ? props.pdfConfig.orientation
    : PDFOrientationOption.Landscape;

  const marginLeft = 40;
  const doc = new jsPDF(orientation, unit, size);

  doc.setFontSize(15);

  const title = props.pdfConfig ? props.pdfConfig.title : "Report";
  const headers: any[] = [];

  var printerData: any[] = [];
  if (props.visibleColumn !== undefined) {
    var head: any[] = [];
    props.visibleColumn.map((col: any) => {
      head.push(col.name);
    });
    headers.push(head);

    const data = props.items.map((elt: any) => {
      let result: any[] = [];
      if (props.visibleColumn !== undefined) {
        props.visibleColumn.map((col: any) => {
          result = [
            ...result,
            elt[!Array.isArray(col.key) ? col.key : col.key[0]],
          ];
        });
      }

      printerData.push({ ...result });
    });
  } else {
    var key = Object.keys(props.items[0]);
    var changedKey: any[] = [];
    key.map((element) => {
      changedKey.push(_.startCase(element));
    });
    headers.push(changedKey);

    props.items.map((element: any) => {
      let result: any[] = [];
      Object.keys(props.items[0]).map((key) => {
        result.push(element[key]);
      });
      printerData.push(result);
    });
  }

  let content = {
    startY: 50,
    head: headers,
    body: printerData,
  };

  doc.text(props.pdfConfig ? props.pdfConfig.title : "Report", marginLeft, 40);
  autoTable(doc, content);
  doc.save(props.pdfConfig ? props.pdfConfig.fileName + ".pdf" : "report.pdf");
};

export default exportPDF;
