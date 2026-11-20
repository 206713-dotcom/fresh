function ChunkLines([string]$s, [string]$label) {
  $max = 1380
  $p = "  [" + $label + "] "
  $res = @()
  if ($null -eq $s -or $s.Length -eq 0) { return $res }
  $rem = $s
  while ($rem.Length -gt 0) {
    $n = [Math]::Min($max, $rem.Length)
    $res += ($p + $rem.Substring(0, $n))
    $rem = $rem.Substring($n)
  }
  return $res
}
$dir = 'C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_02'
$ids = @('141','142','143','144','145','161','162','163','164','165')
$out = @()
foreach ($id in $ids) {
  $d = Get-Content -Raw (Join-Path $dir ("P2_SET_" + $id + ".json")) | ConvertFrom-Json
  $out += ("########## " + $d.scenario_id + " ##########")
  foreach ($q in $d.questions) {
    $out += ("--- " + $q.number + " (mark " + $q.mark_value + ")")
    $out += ChunkLines $q.question_text "Q"
    if ($q.sub_parts) {
      foreach ($sp in $q.sub_parts) {
        $out += ("   sub " + $sp.part + " (" + $sp.marks + "m): " + $sp.question_text)
        $out += ChunkLines $sp.model_answer ("sub" + $sp.part + " A")
      }
    }
    $out += ChunkLines $q.model_answer "A"
    $ms = $q.mark_scheme | ConvertTo-Json -Depth 5
    $out += ChunkLines $ms "MS"
    $app = $q.qwen_marking_keys.valid_app_words | ConvertTo-Json -Depth 3
    $out += ChunkLines $app "APP"
  }
}
$out += ("TOTAL_LINES " + $out.Count)
Set-Content -Path 'C:\Users\jayde\Documents\GitHub\fresh\paper2\audits\wave_02\_digest.txt' -Value $out
'wrote digest lines: ' + $out.Count
