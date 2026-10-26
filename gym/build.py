s=open("index.src.html",encoding="utf-8").read()
open("index.html","w",encoding="utf-8").write(s.replace("__ICON__",open("icon.b64").read().strip()))
