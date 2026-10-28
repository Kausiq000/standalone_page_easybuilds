Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile('C:\Users\Kausiq\.gemini\antigravity-ide\brain\70ef9b1b-1e4e-47c8-bbea-7c8eb325c88b\clean_lounge_wall_1793097654357.jpg')
Write-Host "Width: $($img.Width), Height: $($img.Height)"
$img.Dispose()
