# 版本号更新/打包
$version = Read-Host '请输入版本号！'
Get-ChildItem .\ | ?{$_.psiscontainer -eq $true} | foreach-object -process{
    $directory = $_.Name;
    cd $directory
    npm version $version
    npm publish --access public
    cd ../
}

"`n按任意键退出：" ;
[Console]::Readkey() |　Out-Null ;
Exit ;