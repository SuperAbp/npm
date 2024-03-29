﻿$files = Get-ChildItem .\ | ?{$_.psiscontainer -eq $true}

$fileChoices = @()

for ($i=0; $i -lt $files.Count; $i++) {
  $fileChoices += [System.Management.Automation.Host.ChoiceDescription]("$($files[$i].Name) &$($i+1)")
}
# 选择项目
$fileChoice = $host.UI.PromptForChoice('选择项目', '选择一个项目', $fileChoices, 0)

# 选择版本升级类型
$types = ("主版本号","次版本号","补丁","预览","自定义版本号")
$typeChoices = @()
for ($i=0; $i -lt $types.Count; $i++) {
  $typeChoices += [System.Management.Automation.Host.ChoiceDescription]("$($types[$i]) &$($i+1)")
}

$typeChoice = $host.UI.PromptForChoice('选择《' + $files[$fileChoice].Name + '》升级类型', '选择一个升级类型', $typeChoices, 0) + 1

if($typeChoice -gt 0 -or $typeChoice -lt 6) {
    Switch($typeChoice) {
        "1" {
                cd $files[$fileChoice].FullName
                npm version major                
            };
        "2" {
                cd $files[$fileChoice].FullName
                npm version minor
            }
        "3" {
                cd $files[$fileChoice].FullName
                npm version patch
            }
        "4" {
                cd $files[$fileChoice].FullName
                npm version prerelease
            }
        "5" {
                $version = Read-Host '请输入版本号！'
                cd $files[$fileChoice].FullName
                npm version $version
            }
    }
    npm publish --access public
}

"`n按任意键退出：" ;
[Console]::Readkey() |　Out-Null ;
Exit ;