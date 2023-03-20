

var str = `<p>Do the following:</p>
<ol style="list-style-position: inside;">
<li>Open&nbsp;<strong>regedit</strong>&nbsp;as admin.</li>
<li>Go to path:&nbsp;<strong>HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options\</strong></li>
<li>Delete registry key&nbsp;<strong>setup.exe</strong></li>
<li>Go to&nbsp;<strong>cmd</strong>&nbsp;line and enter&nbsp;<strong>gpudate/force</strong>.</li>
<li>Have user restart the computer.</li>
<li>Install Acrobat software again.</li>
<li>Have user restart computer a second time.</li>
</ol>
<p>If&nbsp;<strong>setup.exe&nbsp;</strong>is&nbsp;<strong>NOT&nbsp;</strong>in the registry:</p>
<p>1. Open&nbsp;<strong>cmd&nbsp;</strong>line&nbsp;as admin, run&nbsp;<strong>SFC /scannow.</strong></p>
<p>2. Run&nbsp;<strong>gpupdate /force.&nbsp;</strong>&nbsp;Lock and unlock workstation (to apply the&nbsp;gpupdate).</p>
<p>3. Repair Adobe in&nbsp;<strong>Control Panel&nbsp;</strong>by selecting&nbsp;<strong>Change</strong>.</p>
<p>4. Open Adobe and attempt to open a PDF.&nbsp;</p>
<p>&nbsp;</p>
<p><strong>If specialists are unable to resolve the issue using existing articles, please follow&nbsp;</strong><a href="https://irworks.for.irs.gov/kb_view.do?sysparm_article=KB00016536" rel="nofollow">KB00016536</a><strong>&nbsp;for the SD/PM Triage process and document all work done to incident.</strong></p>`

console.log(str.match(/<a\s[^>]*href=\"|.([^\"]*)\"[^>]*>(.*?)<\/a>/g))