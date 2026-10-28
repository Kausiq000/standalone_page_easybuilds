Add-Type -AssemblyName System.Drawing
$dir = "C:\Users\Kausiq\.gemini\antigravity-ide\brain\70ef9b1b-1e4e-47c8-bbea-7c8eb325c88b\.tempmediaStorage"
Get-ChildItem -Path $dir | Where-Object { $_.Extension -match '\.(png|jpg|jpeg)' } | ForEach-Object {
    $bmp = New-Object System.Drawing.Bitmap($_.FullName)
    $redPixels = 0
    # Sample every 5 pixels
    for ($x = 0; $x -lt $bmp.Width; $x += 5) {
        for ($y = 0; $y -lt $bmp.Height; $y += 5) {
            $c = $bmp.GetPixel($x, $y)
            # Red dominates over green and blue significantly
            if ($c.R -gt 180 -and ($c.R - $c.G) -gt 70 -and ($c.R - $c.B) -gt 70) {
                # exclude wood tones (where R is high but G is also warm like 100-140)
                if ($c.G -lt 80 -and $c.B -lt 80) {
                    $redPixels++
                }
            }
        }
    }
    $bmp.Dispose()
    if ($redPixels -gt 20) {
        [PSCustomObject]@{
            Name = $_.Name
            RedPixels = $redPixels
        }
    }
}
