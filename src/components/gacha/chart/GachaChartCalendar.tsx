import React from 'react'
import { useTheme } from '@mui/material/styles'
import { resolveCurrency } from '@/interfaces/account'
import { isRankTypeOfBlue, isRankTypeOfPurple, isRankTypeOfGolden } from '@/hooks/useGachaRecordsQuery'
import { useGachaLayoutContext } from '@/components/gacha/GachaLayoutContext'
import { CalendarDatum, ResponsiveTimeRange } from '@nivo/calendar'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import dayjs from '@/utilities/dayjs'

export default function GachaChartCalendar () {
  const { facet, gachaRecords: { aggregatedValues, namedValues: { bangboo } } } = useGachaLayoutContext()
  const { action: currencyAction } = resolveCurrency(facet)

  const calendars = Object
    .entries(Array
      .from(aggregatedValues.values)
      .concat(bangboo?.values || [])
      .reduce((acc, cur) => {
        const key = dayjs(cur.time).format('YYYY-MM-DD')
        if (!acc[key]) {
          acc[key] = 1
        } else {
          acc[key] += 1
        }
        return acc
      }, {} as Record<string, number>)
    )
    .reduce((acc, [key, value]) => {
      acc.push({ day: key, value })
      return acc
    }, [] as CalendarDatum[])

  const metadataByDay: Record<string, { golden: number, purple: number, blue: number }> = {}
  function mergeMetadataByDays (records: typeof aggregatedValues.values) {
    for (const record of records) {
      const day = dayjs(record.time).format('YYYY-MM-DD')
      if (!metadataByDay[day]) {
        metadataByDay[day] = { golden: 0, purple: 0, blue: 0 }
      }
      if (isRankTypeOfGolden(facet, record)) {
        metadataByDay[day].golden += 1
      } else if (isRankTypeOfPurple(facet, record)) {
        metadataByDay[day].purple += 1
      } else if (isRankTypeOfBlue(facet, record)) {
        metadataByDay[day].blue += 1
      }
    }
  }

  Object
    .entries(aggregatedValues.metadata)
    .forEach(([, value]) => {
      mergeMetadataByDays(value.values)
    })

  if (bangboo) {
    mergeMetadataByDays(bangboo.values)
  }

  const now = dayjs()
  const from = now.subtract(1, 'year')

  const theme = useTheme()

  return (
    <Stack direction="column" gap={2}>
      <Typography variant="h6" gutterBottom>{`❖ ${currencyAction}日历`}</Typography>
      <Box position="relative" width="100%" height={220}>
        <ResponsiveTimeRange
          data={calendars}
          from={from.toDate()}
          to={now.toDate()}
          dayBorderWidth={0}
          dayRadius={99}
          daySpacing={2.5}
          minValue={0}
          maxValue={300}
          emptyColor="#eeeeee"
          colors={['#bbdefb', '#c5e1a5', '#ffa726', '#f44336']}
          margin={{ top: 32, right: 64, bottom: 0, left: 16 }}
          weekdayTicks={[0, 2, 4, 6]}
          weekdayLegendOffset={64}
          weekdays={['周日', '周一', '周二', '周三', '周四', '周五', '周六']}
          firstWeekday="sunday"
          monthLegendPosition="before"
          monthLegendOffset={12}
          monthLegend={(_year, _month, date) => {
            const month = date.getMonth() + 1
            return month === 1
              ? `${date.getFullYear()} 年`
              : `${month} 月`
          }}
          theme={{
            text: {
              fontFamily: 'inherit',
              fontSize: 14
            },
            tooltip: {
              // See: https://github.com/plouc/nivo/blob/0f0a926627c370f4ae0ca435a91573a16d96affc/packages/tooltip/src/TooltipWrapper.tsx#L79-L83
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              zIndex: theme.zIndex.drawer + 1
            }
          }}
          tooltip={({ color, day, value }) => (
            <Box component={Paper}
              bgcolor="white"
              width={120}
              paddingY={0.5}
              paddingX={1}
              elevation={5}
            >
              <Box display="flex" alignItems="center">
                <span style={{
                  display: 'inline-block',
                  width: 14,
                  height: 14,
                  borderRadius: 10,
                  backgroundColor: color,
                  marginRight: 8
                }} />
                <Typography component="span" variant="button">{day}</Typography>
              </Box>
              <Box>
                <Typography component="p" variant="button">
                  {`合计：${value}`}
                </Typography>
                <Typography component="p" variant="caption" color="warning.main">
                  {`五星：${metadataByDay[day]?.golden || 0}`}
                  </Typography>
                <Typography component="p" variant="caption" color="secondary.main">
                  {`四星：${metadataByDay[day]?.purple || 0}`}
                </Typography>
                <Typography component="p" variant="caption" color="info.main">
                  {`三星：${metadataByDay[day]?.blue || 0}`}
                </Typography>
              </Box>
            </Box>
          )}
          legendFormat={value => `${value} 次`}
          legends={[
            {
              anchor: 'bottom',
              direction: 'row',
              itemCount: 4,
              itemHeight: 20,
              itemsSpacing: 48,
              itemWidth: 48,
              translateX: 0,
              translateY: -48,
              symbolShape: 'circle'
            }
          ]}
        />
      </Box>
    </Stack>
  )
}
