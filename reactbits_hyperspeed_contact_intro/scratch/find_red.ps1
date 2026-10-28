Add-Type -AssemblyName System.Drawing
$dir = "C:\Users\Kausiq\.gemini\antigravity-ide\brain\70ef9b1b-1e4e-47c8-bbea-7c8eb325c88b\.tempmediaStorage"
Get-ChildItem -Path $dir | Where-Object { $_.Extension -match '\.(png|jpg|jpeg)' } | ForEach-Object {
    $bmp = New-Object System.Drawing.Bitmap($_.FullName)
    $redCount = 0
    # Sample every 10 pixels
    for ($x = 0; $x -lt $bmp.Width; $x += 10) {
        for ($y = 0; $y -lt $bmp.Height; $y += 10) {
            $c = $bmp.GetPixel($x, $y)
            if ($c.R -gt 210 -and $c.G -lt 60 -and $c.B -lt 60) {
                $redCount++
            }
        }
    }
    $bmp.Dispose()
    if ($redCount -gt 5) {
        [PSCustomObject]@{
            Name = $_.Name
            RedCount = $redCount
        }
    }
}
