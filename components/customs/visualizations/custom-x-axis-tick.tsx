interface GetFormattedDisplayTextInput {
  unformattedDisplayText: string;
  idealMaximumCharactersPerLine?: number;
  lineHeight?: number;
  fontSize?: string;
}

const getFormattedDisplayText = (input: GetFormattedDisplayTextInput): React.ReactNode | string => {
  const idealMaximumCharactersPerLine = input.idealMaximumCharactersPerLine;

  if(idealMaximumCharactersPerLine === undefined) {
    return input.unformattedDisplayText;
  }

  const wordsInDisplayText = input.unformattedDisplayText.split(" ")
  const linesInDisplayText = [''];
  let currentIndexInLinesInDisplayText = 0;

  wordsInDisplayText.forEach((wordInDisplayText) => {
    if (linesInDisplayText[currentIndexInLinesInDisplayText].length > idealMaximumCharactersPerLine) {
      linesInDisplayText.push(wordInDisplayText);
      currentIndexInLinesInDisplayText++;
    } else {
      linesInDisplayText[currentIndexInLinesInDisplayText] = linesInDisplayText[currentIndexInLinesInDisplayText] + ' ' + wordInDisplayText;
    }
  })

  return (
    <>
      {linesInDisplayText.map((lineInDisplayText, index) => (
        <tspan
          textAnchor="middle"
          x='0'
          key={lineInDisplayText}
          {...(input.fontSize ? { fontSize: input.fontSize } : {} )}
          {...((!!input.lineHeight || input.lineHeight === 0)
            ? { dy: index === 0 ? 10 : 10 + (input.lineHeight / 2) }
            : { dy: index === 0 ? 10 : 20 }
          )}
        >
          {lineInDisplayText}
        </tspan>
      ))}
    </>
  )
};

export interface CustomXAxisTickProps {
  x: number,
  y: number,
  payload: {
    value: string
  },
  idealMaximumCharactersPerLine?: number,
  fontSize?: string,
  lineHeight?: number,
  tickSlant?: number
}

export const CustomXAxisTick = (props: CustomXAxisTickProps) => {
  const { x, y, payload } = props;

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="end"
        fill="#666"
        transform={`rotate(-${props.tickSlant ?? 0})`}
      >
        {getFormattedDisplayText({
          unformattedDisplayText: payload.value,
          idealMaximumCharactersPerLine: props.idealMaximumCharactersPerLine,
          fontSize: props.fontSize
        })}
      </text>
    </g>
  );
}