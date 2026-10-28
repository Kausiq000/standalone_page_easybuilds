Add-Type -AssemblyName System.Drawing

$orig = [System.Drawing.Bitmap]::FromFile((Resolve-Path "scratch/laptop_full.jpg"))
$gen = [System.Drawing.Bitmap]::FromFile((Resolve-Path "scratch/gen_resized_550x591.jpg"))

# Compare a patch that should be unchanged:
# The mug and notepad area: x from 300 to 450, y from 260 to 440
$bestSad = 1e12
$bestDx = 0
$bestDy = 0

for ($dy = -10; $dy -le 10; $dy++) {
    for ($dx = -10; $dx -le 10; $dx++) {
        $sad = 0
        $count = 0
        for ($y = 280; $y -lt 400; $y += 2) {
            $gy = $y + $dy
            if ($gy -lt 0 -or $gy -ge $gen.Height) { continue }
            for ($x = 350; $x -lt 450; $x += 2) {
                $gx = $x + $dx
                if ($gx -lt 0 -or $gx -ge $gen.Width) { continue }
                $po = $orig.GetPixel($x, $y)
                $pg = $gen.GetPixel($gx, $gy)
                $sad += [Math]::Abs([int]$po.R - [int]$pg.R) + [Math]::Abs([int]$po.G - [int]$pg.G) + [Math]::Abs([int]$po.B - [int]$pg.B)
                $count++
            }
        }
        if ($count -gt 0) {
            $avgSad = $sad / $count
            if ($avgSad -lt $bestSad) {
                $bestSad = $avgSad
                $bestDx = $dx
                $bestDy = $dy
            }
        }
    }
}

Write-Host "Optimal offset: dx=$bestDx, dy=$bestDy (avg SAD=$([Math]::Round($bestSad, 2)))"

$orig.Dispose()
$gen.Dispose()
