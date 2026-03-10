interface CellConfig {
  colSpan?: number;
  rowSpan?: number;
}

type CellData = string | [string, CellConfig];

interface Props {
  data: CellData[][];
  rowsHead: number;
  colsHead: number | number[];
}

const MyTable = ({ data, rowsHead, colsHead: c_ }: Props) => {
  const rows = data.length;
  const headData = data.slice(0, rowsHead);
  const bodyData = data.slice(rowsHead);
  const colsHead = (() => {
    if (Array.isArray(c_)) {
      return c_;
    }
    return [...Array(rows)].map(() => c_);
  })();
  const cols = data.map((r) => r.length).reduce((p, c) => Math.max(p, c), 0);
  return (
    <table
      style={{
        gridTemplateColumns: `repeat(${cols}, auto)`,
        gridTemplateRows: `repeat(${rows}, auto)`,
      }}
    >
      <thead>
        {headData.map((row, i) => {
          const cols = colsHead[i] ?? 0;
          const ths = row.slice(0, cols);
          const tds = row.slice(cols);
          return (
            <tr>
              {ths.map((th) => {
                if (typeof th === 'string') {
                  return <th key={th}>{th}</th>;
                }
                const [str, conf] = th;
                const { colSpan, rowSpan } = conf;
                return (
                  <th
                    key={str}
                    colSpan={colSpan}
                    rowSpan={rowSpan}
                    style={{
                      gridColumn: colSpan && `span ${colSpan}`,
                      gridRow: rowSpan && `span ${rowSpan}`,
                    }}
                  >
                    {str}
                  </th>
                );
              })}
              {tds.map((td) => {
                if (typeof td === 'string') {
                  return <td key={td}>{td}</td>;
                }
                const [str, conf] = td;
                const { colSpan, rowSpan } = conf;
                return (
                  <td
                    key={str}
                    colSpan={colSpan}
                    rowSpan={rowSpan}
                    style={{
                      gridColumn: colSpan && `span ${colSpan}`,
                      gridRow: rowSpan && `span ${rowSpan}`,
                    }}
                  >
                    {str}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </thead>
      <tbody>
        {bodyData.map((row, i) => {
          const cols = colsHead[i] ?? 0;
          const ths = row.slice(0, cols);
          const tds = row.slice(cols);
          return (
            <tr>
              {ths.map((th) => {
                if (typeof th === 'string') {
                  return <th key={th}>{th}</th>;
                }
                const [str, conf] = th;
                const { colSpan, rowSpan } = conf;
                return (
                  <th
                    key={str}
                    colSpan={colSpan}
                    rowSpan={rowSpan}
                    style={{
                      gridColumn: colSpan && `span ${colSpan}`,
                      gridRow: rowSpan && `span ${rowSpan}`,
                    }}
                  >
                    {str}
                  </th>
                );
              })}
              {tds.map((td) => {
                if (typeof td === 'string') {
                  return <td key={td}>{td}</td>;
                }
                const [str, conf] = td;
                const { colSpan, rowSpan } = conf;
                return (
                  <td
                    key={str}
                    colSpan={colSpan}
                    rowSpan={rowSpan}
                    style={{
                      gridColumn: colSpan && `span ${colSpan}`,
                      gridRow: rowSpan && `span ${rowSpan}`,
                    }}
                  >
                    {str}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default MyTable;
