# 删除所有发布文件
Remove-Item dist\* -Recurse

# 版本号更新/打包
$version = Read-Host '请输入版本号！'
Get-ChildItem projects\ | ?{$_.psiscontainer -eq $true} | foreach-object -process{
    $directory = $_.Name;
    cd projects\$directory
    npm version $version
    cd ../../
    $packageCmd = "build_lib:" + $directory  
    npm run $packageCmd
}

# 发布所有包文件
Get-ChildItem dist\ | ?{$_.psiscontainer -eq $true} | ForEach-Object -Process{
    Write-Host "当前路径: $($_.FullName)"
    cd $_.FullName
    npm publish --access public
}

"`n按任意键退出：" ;
[Console]::Readkey() |　Out-Null ;
Exit ;