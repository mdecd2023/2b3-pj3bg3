var tipuesearch = {"pages": [{'title': 'About', 'text': '倉儲: https://github.com/mdecd2023/2b3-pj3bg3 \n 網站: https://mdecd2023.github.io/2b3-pj3bg3/ \n 組長: \n 41023226 陳建霖 \n 組員: \n 自己填 \n 41023230 彭聖宗 \n 41023233 黃文彥 \n 41023231 湛有杰 \n 41023232 雲敬家 \n 41023253 謝宗銘 \n 41023220 陳冠珉 \n 41023250 蔡叡得 \n \n', 'tags': '', 'url': 'About.html'}, {'title': 'pj3', 'text': '專案三: 接續專案二, 各組需 對雙輪車進行設計改良,\xa0 以提升行進與對戰效能 , 各組需採 CAD 進行場景與多輪車零組件設計後, 轉入足球場景中 以鍵盤 arrow keys 與 wzas 等按鍵進行控制 , 對陣雙方每組將有 四名輪車球員 , 且每兩人在同一台電腦上操作, 完成後各組需在分組網站中提供所有相關檔案 下載連結 , 且提供 線上分組簡報 與 分組 pdf 報告 連結. \n 球賽計分系統必須採 .ttm 格式建立 (0~99), 使能通用於各類場景計數之用, 並可擴增至三位數計分. \n 除了採用 LED 顯示計分外, 請另外以建立以 機械轉盤傳動計分系統 \xa0 ( mechanical counter ), 且採 .ttm 格式建立. \n 協同產品設計規格: \n 足球規格 (ball): 白色, 直徑 0.1m, 重量 0.5kg \n 足球場地 (field): 長 4m x 寬 2.5m \n 球門規格 (goal[0] and goal[1]: 長 0.6m, 高 0.3m, 寬 0.1m \n 球員尺寸範圍(player[0]-player[7]: 長寬高各 0.2m, 重量 5kg \n \n 應交付內容: \n 專案三場景與多輪車零組件設計 (可使用各種 CAD 系統建立, 但必須提供完整的檔案下載連結) \n 專案三控制程式 (以 zmqRemoteAPI Python 製作) \n 專案三開會紀錄與逐字稿 (可利用 jit.si 或 OBS 或其他線上開會系統) \n 專案三各組員任務分配與執行過程影片 (可置於 Youtube 或 Onedrive) \n 專案三網站包括所有協同設計流程所衍生的檔案下載連結, 各檔案必須設法壓縮在 30 MB 內並置於網站downloads 目錄中. \n 專案三線上簡報檔案 \n 專案三分組報告 pdf 檔案 \n 直接利用 zmqRemoteAPI Python 程式建立場景物件: \n # zmqRemoteApi_IPv6 為將 zmq 通訊協定修改為 IPv4 與 IPv6 相容\nfrom zmqRemoteApi_IPv6 import RemoteAPIClient\nimport time\nimport math\nimport keyboard\n\n# 利用 zmqRemoteAPI 以 23000 對場景伺服器進行連線\nclient = RemoteAPIClient(\'localhost\', 23000)\n# 以 getObject 方法取得場景物件\nsim = client.getObject(\'sim\')\nbox = sim.getObject(\'/box\')\n\n# 啟動模擬\nsim.startSimulation()\n# 建立尺寸數列, 分別定義 x, y, z 方向尺寸\nx = 0.2\ny = 0.2\nz = 0.1\nsize = [x, y, z]\n\n# 利用 size 數列, 建立圓柱物件, 2 代表 cylinder\n# 8 表示 respondable, 1 為 質量\ndigit1_handle = sim.createPureShape(2, 8, size, 1, None)\n# 將圓柱物件命名為 digit1, 若用於機械計分可做為個位數轉盤\n# 之後可再導入帶有數字組立的外型零件\nsim.setObjectAlias(digit1_handle, \'digit1\')\n# 轉角單位為徑度\nsim.setObjectOrientation(digit1_handle, -1, [0, math.pi/2, 0])\n# 起始物件中心位於 [0, 0, 0], 為了位於地板, 往 z 提升一個半徑高度\nsim.setObjectPosition(digit1_handle, -1, [0, 0, x/2])\n\n# 建立 revolute joint 命名為 joint, 且將 joint mode 設為 dynamic, control mode 設為 velocity\njoint1_handle = sim.createJoint(sim.joint_revolute_subtype, sim.jointmode_dynamic, 0, None)\nsim.setObjectInt32Param(joint1_handle, sim.jointintparam_dynctrlmode, sim.jointdynctrl_velocity)\nsim.setObjectAlias(joint1_handle, \'joint1\')\n\n# 取得 cylinder 的位置座標\ndigit1_pos = sim.getObjectPosition(digit1_handle, -1)\njoint1_pos = [digit1_pos[0], digit1_pos[1], digit1_pos[2]]\n\n# 將 joint1 至於 cylinder 中心\nsim.setObjectPosition(joint1_handle, -1, joint1_pos)\n# 取得 digit1_handle 的方位\ndigit1_ori = sim.getObjectOrientation(digit1_handle, -1)\n# 將 joint1_handle 方位與 digit1 對齊\nsim.setObjectOrientation(joint1_handle, -1, digit1_ori)\n\n# 將 joint1 置於 box 上\nsim.setObjectParent(joint1_handle, box, True)\n# 將 cylinder 置於 joint1 上\nsim.setObjectParent(digit1_handle, joint1_handle, True)\n\n# 鎖定 joint1\nsim.setJointForce(joint1_handle, float(\'inf\'))\n\nprint("基本場景建立完成!")\n\n# 設定主迴圈\nwhile True:\n    # 設定 joint1 目標速度\n    sim.setJointTargetVelocity(joint1_handle, 10)\n    # 讓 coppeliasim 有時間按照設定讓 joint1 旋轉\n    time.sleep(0.01) \n\n    if keyboard.is_pressed(\'q\'):\n        # 可以按下 q 鍵跳出重複執行迴圈\n        break\n\n# 終止模擬\n#sim.stopSimulation() \n', 'tags': '', 'url': 'pj3.html'}, {'title': 'group', 'text': '41023226: resume  ( repo ),  football  ( repo ),  pj1  ( repo ),  pj2  ( repo ),  pj3  ( repo ) \n 41023233: resume  ( repo ),  football  ( repo ),  pj1  ( repo ),  pj2  ( repo ),  pj3  ( repo ) \n 41023220: resume  ( repo ),  football  ( repo ),  pj1  ( repo ),  pj2  ( repo ),  pj3  ( repo ) \n 41023232: resume  ( repo ),  football  ( repo ),  pj1  ( repo ),  pj2  ( repo ),  pj3  ( repo ) \n 41023230: resume  ( repo ),  football  ( repo ),  pj1  ( repo ),  pj2  ( repo ),  pj3  ( repo ). \n 41023253: resume  ( repo ) ,   football  ( repo ),  pj1  ( repo ),  pj2  ( repo ),  pj3  ( repo ) \n 41023231: resume  ( repo ),  football  ( repo ),  pj1  ( repo ),  pj2  ( repo ),  pj3  ( repo ) \n \n 2b亂數 \n  導入 brython 程式庫  \n \n \n \n \n  啟動 Brython  \n \n \n \n  導入 FileSaver 與 filereader  \n \n \n \n \n  導入 ace  \n \n \n \n \n \n \n  導入 gearUtils-0.9.js Cango 齒輪繪圖程式庫  \n \n \n \n \n \n \n  請注意, 這裡使用 Javascript 將 localStorage["kw_py_src1"] 中存在近端瀏覽器的程式碼, 由使用者決定存檔名稱 \n \n \n \n \n \n \n  add 1 to 100 開始  \n \n \n  add 1 to 100 結束 \n  editor1 開始  \n  用來顯示程式碼的 editor 區域  \n \n  以下的表單與按鈕與前面的 Javascript doSave 函式以及 FileSaver.min.js 互相配合  \n  存擋表單開始  \n Filename:  .py   \n  存擋表單結束  \n \n  執行與清除按鈕開始  \n Run   Output   清除輸出區 清除繪圖區 Reload \n  執行與清除按鈕結束  \n \n  程式執行 ouput 區  \n \n  Brython 程式執行的結果, 都以 brython_div1 作為切入位置  \n \n  editor1 結束   ##########################################  \n \n', 'tags': '', 'url': 'group.html'}, {'title': '討論', 'text': '\n \n 5/22討論的大致內容 : 裡面討論我們對每個人對車子的設計理念，還有設計記分板的雛型', 'tags': '', 'url': '討論.html'}]};