import { Component, TemplateRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ScheduledCarsCount } from './ScheduledCarsCount';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { MatSort } from '@angular/material/sort';
import { ELEMENT_DATA } from './data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  displayedColumns: string[] = [
    'labelDesc',
    'dvnt',
    'dvnl',
    'dvnh',
    'gem',
    'mvt',
    'tht',
    'lrh',
    'totalDivisions',
  ];
  dataSource = ELEMENT_DATA;
  public confirmModal!: BsModalRef;
  public modalMessage!: BsModalRef;
  carList: ScheduledCarsCount[] = ELEMENT_DATA;

  constructor(private modalService: BsModalService) {}
  // +++++++++Download report+++++++++
  downloadDialog(template: TemplateRef<any>) {
    this.confirmModal = this.modalService.show(template, {
      class: 'modal-md',
    });
  }

  cancelAdding() {
    this.confirmModal.hide();
  }

  //+++++PDF download++++++++++++++++++
  downloadPdf() {
    const prepare: (string | number)[][] = [];
    this.carList.forEach((e) => {
      const tempObj = [];
      tempObj.push(e.labelDesc);
      tempObj.push(e.dvnt);
      tempObj.push(e.dvnl);
      tempObj.push(e.dvnh);
      tempObj.push(e.gem);
      tempObj.push(e.mvt);
      tempObj.push(e.tht);
      tempObj.push(e.lrh);
      tempObj.push(e.totalDivisions);
      console.log(e.labelDesc);
      prepare.push(tempObj);
    });
    const doc = new jsPDF('portrait', 'px', 'a4');
    const reportHeadings = [
      'JANUARY 2022 MTD Total',
      'FEBRUARY 2022 MTD Total',
      'MARCH 2022 MTD Total',
      'APRIL 2022 MTD Total',
      'MAY 2022 MTD Total',
      'JUNE 2022 MTD Total',
      'JULY 2022 MTD Total',
      'AUGUST 2022 MTD Total',
      'SEPTEMBER 2022 MTD Total',
      'OCTOBER 2022 MTD Total',
      'NOVEMBER 2022 MTD Total',
      'DECEMBER 2022 MTD Total',
      '2022 YTD Total',
    ];
    const contentReport = [
      'Accessories',
      'Tint/PPF',
      'Rust Module/Rustproofing',
    ];
    var currentRow = 0;
    const rowsPerPage = 32;
    var xOffset = doc.internal.pageSize.width / 2;
    doc.text('Report Accessories', xOffset, 20, { align: 'center' });
    autoTable(doc, {
      head: [
        [
          '',
          'DVNT',
          'DVNL',
          'DVNH',
          'GEM',
          'MVT',
          'THT',
          'LRH',
          'Total All Divisions',
        ],
      ],
      body: prepare,
      theme: 'grid',
      didParseCell: function (data) {
        if (reportHeadings.includes(data.row.cells[0].text[0])) {
          data.cell.styles.fillColor = [224, 224, 224];
        }
      },
      didDrawCell: function (data) {
        if (
          data.row.index > 0 &&
          data.row.index % 19 === 0 &&
          data.column.index === data.table.columns.length - 1
        ) {
          doc.addPage();
        }
      },
    });
    doc.setFont('Lato-Regular', 'normal');
    doc.save('Report_Accessories_' + '.pdf');
  }
}
