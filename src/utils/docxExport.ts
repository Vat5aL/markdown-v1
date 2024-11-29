import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, BorderStyle, AlignmentType, convertInchesToTwip, WidthType, ITableBordersOptions, ShadingType } from 'docx';
import { saveAs } from 'file-saver';
import { marked } from 'marked';

const themeStyles = {
  modern: {
    h1: { 
      color: "6B46C1", 
      size: 48, 
      spacing: 480,
      background: "F3E8FF",
      gradientFrom: "7C3AED",
      gradientTo: "9333EA"
    },
    h2: { color: "9333EA", size: 36, spacing: 360, background: "F3E8FF" },
    h3: { color: "7C3AED", size: 30, spacing: 240, borderColor: "7C3AED" },
    table: { headerColor: "F3E8FF", borderColor: "E9D5FF" }
  },
  vintage: {
    h1: { 
      color: "92400E", 
      size: 48, 
      spacing: 480,
      background: "FEF3C7",
      gradientFrom: "B45309",
      gradientTo: "D97706"
    },
    h2: { color: "B45309", size: 36, spacing: 360, background: "FEF3C7" },
    h3: { color: "D97706", size: 30, spacing: 240, borderColor: "D97706" },
    table: { headerColor: "FEF3C7", borderColor: "FDE68A" }
  },
  minimal: {
    h1: { 
      color: "111827", 
      size: 48, 
      spacing: 480,
      background: "F3F4F6",
      gradientFrom: "374151",
      gradientTo: "4B5563"
    },
    h2: { color: "374151", size: 36, spacing: 360, background: "F3F4F6" },
    h3: { color: "4B5563", size: 30, spacing: 240, borderColor: "4B5563" },
    table: { headerColor: "F3F4F6", borderColor: "E5E7EB" }
  },
  nature: {
    h1: { 
      color: "047857", 
      size: 48, 
      spacing: 480,
      background: "ECFDF5",
      gradientFrom: "059669",
      gradientTo: "10B981"
    },
    h2: { color: "059669", size: 36, spacing: 360, background: "ECFDF5" },
    h3: { color: "10B981", size: 30, spacing: 240, borderColor: "10B981" },
    table: { headerColor: "ECFDF5", borderColor: "A7F3D0" }
  }
};

const parseInlineStyles = (text: string): TextRun[] => {
  const tokens = marked.lexer(text);
  const runs: TextRun[] = [];

  const processToken = (token: marked.Token): TextRun[] => {
    if (token.type === 'text') {
      return [new TextRun({ text: token.text, size: 24 })];
    } else if (token.type === 'strong') {
      return [new TextRun({ text: token.text, size: 24, bold: true })];
    } else if (token.type === 'em') {
      return [new TextRun({ text: token.text, size: 24, italics: true })];
    } else if (token.type === 'del') {
      return [new TextRun({ text: token.text, size: 24, strike: true })];
    } else if (token.type === 'codespan') {
      return [new TextRun({ 
        text: token.text, 
        size: 24,
        font: 'Consolas',
        color: '6B7280'
      })];
    }
    return [new TextRun({ text: token.raw, size: 24 })];
  };

  tokens.forEach(token => {
    if (token.type === 'paragraph') {
      token.tokens?.forEach(inlineToken => {
        runs.push(...processToken(inlineToken));
      });
    } else {
      runs.push(...processToken(token));
    }
  });

  return runs;
};

const createHeading = (text: string, level: HeadingLevel, style: any) => {
  const headingStyle = level === HeadingLevel.HEADING_1 
    ? style.h1 
    : level === HeadingLevel.HEADING_2 
    ? style.h2 
    : style.h3;

  const options: any = {
    children: parseInlineStyles(text),
    heading: level,
    spacing: {
      before: headingStyle.spacing,
      after: headingStyle.spacing / 2
    }
  };

  if (level === HeadingLevel.HEADING_1) {
    options.shading = {
      type: ShadingType.CLEAR,
      fill: headingStyle.background,
      color: headingStyle.background
    };
    options.border = {
      left: {
        color: headingStyle.gradientFrom,
        size: 6,
        style: BorderStyle.SINGLE
      }
    };
  } else if (level === HeadingLevel.HEADING_2) {
    options.shading = {
      type: ShadingType.CLEAR,
      fill: headingStyle.background,
      color: headingStyle.background
    };
  } else if (level === HeadingLevel.HEADING_3) {
    options.border = {
      left: {
        color: headingStyle.borderColor,
        size: 4,
        style: BorderStyle.SINGLE
      }
    };
  }

  return new Paragraph(options);
};

const createTable = (rows: string[][], style: any) => {
  const borders: ITableBordersOptions = {
    top: { style: BorderStyle.SINGLE, size: 1, color: style.table.borderColor },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: style.table.borderColor },
    left: { style: BorderStyle.SINGLE, size: 1, color: style.table.borderColor },
    right: { style: BorderStyle.SINGLE, size: 1, color: style.table.borderColor },
    insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: style.table.borderColor },
    insideVertical: { style: BorderStyle.SINGLE, size: 1, color: style.table.borderColor }
  };

  const tableRows = rows.map((row, rowIndex) => 
    new TableRow({
      children: row.map(cell => 
        new TableCell({
          children: [new Paragraph({
            children: parseInlineStyles(cell),
            spacing: { before: 120, after: 120 }
          })],
          shading: rowIndex === 0 ? {
            type: ShadingType.CLEAR,
            fill: style.table.headerColor,
            color: style.table.headerColor
          } : undefined
        })
      ),
      tableHeader: rowIndex === 0
    })
  );

  return new Table({
    rows: tableRows,
    width: {
      size: 100,
      type: WidthType.PERCENTAGE
    },
    borders
  });
};

export const exportToDocx = async (markdown: string, theme: keyof typeof themeStyles) => {
  const style = themeStyles[theme];
  const sections: (Paragraph | Table)[] = [];
  
  const lines = markdown.split('\n');
  let tableRows: string[][] = [];
  let inTable = false;
  let inMultilineNote = false;
  let noteContent: string[] = [];

  for (const line of lines) {
    if (line.startsWith('# ')) {
      sections.push(createHeading(line.slice(2), HeadingLevel.HEADING_1, style));
    } else if (line.startsWith('## ')) {
      sections.push(createHeading(line.slice(3), HeadingLevel.HEADING_2, style));
    } else if (line.startsWith('### ')) {
      sections.push(createHeading(line.slice(4), HeadingLevel.HEADING_3, style));
    } else if (line.startsWith('>>')) {
      inMultilineNote = true;
      noteContent = [line.slice(2)];
    } else if (line.endsWith('<<') && inMultilineNote) {
      inMultilineNote = false;
      noteContent.push(line.slice(0, -2));
      sections.push(new Paragraph({
        children: parseInlineStyles(noteContent.join('\n')),
        spacing: { before: 120, after: 120 },
        indent: { left: convertInchesToTwip(0.5) },
        shading: {
          type: ShadingType.CLEAR,
          fill: 'F3F4F6',
          color: 'F3F4F6'
        }
      }));
    } else if (inMultilineNote) {
      noteContent.push(line);
    } else if (line.startsWith('|')) {
      inTable = true;
      if (!line.includes('---')) {
        const cells = line
          .split('|')
          .filter(cell => cell.trim() !== '')
          .map(cell => cell.trim());
        tableRows.push(cells);
      }
    } else if (inTable && !line.startsWith('|')) {
      if (tableRows.length > 0) {
        sections.push(createTable(tableRows, style));
        tableRows = [];
      }
      inTable = false;
      
      if (line.trim() !== '') {
        sections.push(new Paragraph({
          children: parseInlineStyles(line),
          spacing: { before: 120, after: 120 }
        }));
      }
    } else if (line.trim() === '---') {
      sections.push(new Paragraph({
        children: [new TextRun({ text: '⎯'.repeat(50), size: 24, color: "666666" })],
        spacing: { before: 120, after: 120 }
      }));
    } else if (!inTable && line.trim() !== '') {
      sections.push(new Paragraph({
        children: parseInlineStyles(line),
        spacing: { before: 120, after: 120 }
      }));
    }
  }

  if (tableRows.length > 0) {
    sections.push(createTable(tableRows, style));
  }

  const doc = new Document({
    sections: [{ 
      properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
      children: sections
    }]
  });

  const buffer = await Packer.toBlob(doc);
  saveAs(buffer, 'document.docx');
};