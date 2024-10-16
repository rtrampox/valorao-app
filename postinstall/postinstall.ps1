# PowerShell script to modify files in react-native-reanimated-skeleton

$directory = ".\node_modules\react-native-reanimated-skeleton"

Get-ChildItem -Path $directory -Recurse -File | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    
    # Perform the replacements
    $content = $content -replace 'import LinearGradient', 'import { LinearGradient }'
    $content = $content -replace 'react-native-linear-gradient', 'expo-linear-gradient'
    
    # Write the modified content back to the file
    $content | Set-Content $_.FullName -NoNewline
}

Write-Host "File modifications complete."