const ssToHms = ss => {
  ss = Number(ss)
  const hour = 60 * 60

  let h = Math.floor(ss / hour)
  let m = (Array(h && 2).join('0') + Math.floor(ss % hour / 60)).slice(-(h && 2))
  let s = (Array(2).join('0') + Math.floor(ss % hour % 60)).slice(-2)

  return [h, m, s].filter(Boolean).join(':')
}
