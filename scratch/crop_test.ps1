Add-Type -AssemblyName System.Drawing
$source = "c:\xampp\htdocs\abmfm-html\img\verticals\WhatsApp Image 2026-09-06 at 4.40.30 PM.jpeg"
$bmp = New-Object System.Drawing.Bitmap($source)
Write-Host "Width: $($bmp.Width), Height: $($bmp.Height)"

# Find the exact boundary of the left card:
# The slide has rounded card on left. Let's crop x: 25, y: 25, width: 710, height: 850
$rect = New-Object System.Drawing.Rectangle(25, 25, 715, 850)
$crop = $bmp.Clone($rect, $bmp.PixelFormat)
$crop.Save("c:\xampp\htdocs\abmfm-html\img\verticals\test-left-card.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$crop.Dispose()
Write-Host "Saved test-left-card.png"
