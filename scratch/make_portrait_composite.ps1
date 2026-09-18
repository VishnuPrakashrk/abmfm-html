Add-Type -AssemblyName System.Drawing

$origPath = "c:\xampp\htdocs\abmfm-html\img\perspective-beyond-maintenance.jpg"
$portraitGenPath = "C:\Users\admin\.gemini\antigravity-ide\brain\26767555-6832-4021-984c-319783a4729d\perspective_beyond_maintenance_portrait_1789711129524.jpg"
$outPath = "c:\xampp\htdocs\abmfm-html\img\perspective-beyond-maintenance-perfect.jpg"

$orig = [System.Drawing.Bitmap]::FromFile($origPath)
$gen = [System.Drawing.Bitmap]::FromFile($portraitGenPath)

# Target dimensions: 1024 wide x 1365 tall (3:4 aspect ratio)
$canvasWidth = 1024
$canvasHeight = 1365

$targetBmp = New-Object System.Drawing.Bitmap($canvasWidth, $canvasHeight, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($targetBmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

# 1. Fill base with top atrium from $gen scaled to canvas width
# In $gen (896x1200), top atrium is 0 to 500
$g.DrawImage($gen, 
    [System.Drawing.Rectangle]::new(0, 0, $canvasWidth, 600),
    [System.Drawing.Rectangle]::new(0, 0, $gen.Width, [int]($gen.Height * 0.45)),
    [System.Drawing.GraphicsUnit]::Pixel)

# 2. Draw original image at y = 350 to 1032
# Orig is 1024x682
$origY = 320
$g.DrawImage($orig, 0, $origY, 1024, 682)

# 3. Blend the seam between top atrium and original image (around y = 320 to 450)
# Original image top (y = 0 to 120 in orig, corresponding to canvas 320 to 440) is atrium wall/glass.
# Let's create a smooth linear alpha blend at the seam:
for ($y = 0; $y -lt 80; $y++) {
    $alpha = [int](255 * (1.0 - ($y / 80.0)))
    if ($alpha -gt 255) { $alpha = 255 }
    if ($alpha -lt 0) { $alpha = 0 }
    
    # We can sample the gen image at that y and blend
}

# 4. Fill below y = (320 + 682) = 1002 down to 1365 with navy dark color matching the bottom of orig (#0A1931 / suits)
$navyBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 10, 25, 49))
$g.FillRectangle($navyBrush, 0, 1000, $canvasWidth, 365)

# Also sample the bottom row of orig to create a smooth gradient from orig to navy
for ($y = 0; $y -lt 60; $y++) {
    $factor = $y / 60.0
    $alpha = [int](255 * $factor)
    $blendBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb($alpha, 10, 25, 49))
    $g.FillRectangle($blendBrush, 0, 950 + $y, $canvasWidth, 1)
    $blendBrush.Dispose()
}

$navyBrush.Dispose()
$g.Dispose()

# Save as JPEG with 95% quality
$encoder = [System.Drawing.Imaging.Encoder]::Quality
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter($encoder, [long]95)
$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }

$targetBmp.Save($outPath, $jpegCodec, $encoderParams)

$orig.Dispose()
$gen.Dispose()
$targetBmp.Dispose()
Write-Host "Created $outPath"
