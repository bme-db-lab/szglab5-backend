const pdf = require('pdfjs')

module.exports = (req, res) => {
  // available variables: pdf, fonts, logo, lorem

  const font = new pdf.Font(require('pdfjs/font/Helvetica.json'));
  var doc = new pdf.Document({ font: font })

  var header = doc.header().table({ widths: [null, null], paddingBottom: 1*pdf.cm }).row()
  header.cell().text({ textAlign: 'left' })
    .add('hello!');
  header.cell().text({ textAlign: 'right' })
    .add('A Portable Document Format (PDF) generation library targeting both the server- and client-side.')
    .add('https://github.com/rkusa/pdfjs', {
      link: 'https://github.com/rkusa/pdfjs',
      underline: true,
      color: 0x569cd6
    })

  doc.footer()
    .pageNumber(function(curr, total) { return curr + ' / ' + total }, { textAlign: 'center' })

  var cell = doc.cell({ paddingBottom: 0.5*pdf.cm })
  cell.text('Features:', { fontSize: 16 })
  cell.text({ fontSize: 14, lineSpacing: 1.35 })
    .add('-')
    .add('different', { color: 0xf8dc3f })
    .add('font', { font })
    .add('styling', { underline: true })
    .add('options', { fontSize: 9 })
    cell.text('- Images (JPEGs, other PDFs)')
  cell.text('- Tables (fixed layout, header row)')
  cell.text('- AFM fonts && OTF font embedding (as CID fonts, i.e., support for fonts with large character sets)')
  cell.text('- Add existing PDFs (merge them or add them as page templates)')

  doc.cell({ paddingBottom: 0.5*pdf.cm }).text()
    .add('For more information visit the')
    .add('Documentation', {
      link: 'https://github.com/rkusa/pdfjs/tree/master/docs',
      underline: true,
      color: 0x569cd6
    })

  var table = doc.table({
    widths: [1.5*pdf.cm, 1.5*pdf.cm, null, 2*pdf.cm, 2.5*pdf.cm],
    borderHorizontalWidths: function(i) { return i < 2 ? 1 : 0.1 },
    padding: 5
  })

  var tr = table.header({ font: font, borderBottomWidth: 1.5 })
  tr.cell('#')
  tr.cell('Unit')
  tr.cell('Subject')
  tr.cell('Price', { textAlign: 'right' })
  tr.cell('Total', { textAlign: 'right' })

  function addRow(qty, name, desc, price) {
    var tr = table.row()
    tr.cell(qty.toString())
    tr.cell('pc.')

    var article = tr.cell().text()
    article.add(name, { font })
          .br()
          .add(desc, { fontSize: 11, textAlign: 'justify' })

    tr.cell(price.toFixed(2) + ' €', { textAlign: 'right' })
    tr.cell((price * qty).toFixed(2) + ' €', { textAlign: 'right' })
  }

  addRow(2, 'Article A', 'Do esse qui nulla nulla esse fugiat. Eu ut non ea aliqua minim nostrud ad ut. Fugiat quis magna laboris amet enim mollit sunt minim. In eiusmod nulla ad ipsum. Sit sit do in elit enim anim do cupidatat occaecat incididunt. Tempor aute sunt aliqua nulla ullamco ex cupidatat aute aute laboris. Dolore excepteur est occaecat veniam aliquip elit exercitation pariatur pariatur commodo.', 500)
  addRow(5, 'Article F', 'Do esse qui nulla nulla esse fugiat. Eu ut non ea aliqua minim nostrud ad ut. Fugiat quis magna laboris amet enim mollit sunt minim. In eiusmod nulla ad ipsum. Sit sit do in elit enim anim do cupidatat occaecat incididunt. Tempor aute sunt aliqua nulla ullamco ex cupidatat aute aute laboris. Dolore excepteur est occaecat veniam aliquip elit exercitation pariatur pariatur commodo.', 50)

  doc.asBuffer()
    .then((data) => {
      res.download(data);
    })
    .catch((err) => {
      console.log(err);
      res.send('error');
    });
};
