const encoding = require('encoding-japanese');

window.onload = () => {
  const b2Headers = ["お客様管理番号",
                     "送り状種類", // 0 : 発払い 3 : ＤＭ便 4 : タイム 5 : 着払い 7 : ネコポス 8 : 宅急便コンパクト
                     "クール区分", // 0：通常 2:クール冷蔵 1:クール冷凍
                     "伝票番号",
                     "出荷予定日",　// 毎回
                     "お届け予定日",
                     "配達時間帯",
                     "お届け先コード",
                     "お届け先電話番号", // 電話番号(配送先)
                     "お届け先電話番号枝番", //
                     "お届け先郵便番号", // 郵便番号(配送先)
                     "お届け先住所", // 都道府県(配送先)+住所(配送先)
                     "お届け先アパートマンション名",
                     "お届け先会社・部門１",
                     "お届け先会社・部門２",
                     "お届け先名", // 氏(配送先)+名(配送先)
                     "お届け先名(ｶﾅ)",
                     "敬称",
                     "ご依頼主コード",
                     "ご依頼主電話番号", // 固定 or電話番号(購入者)
                     "ご依頼主電話番号枝番",
                     "ご依頼主郵便番号",// 固定 or 郵便番号(購入者)
                     "ご依頼主住所",// 固定 or 都道府県(購入者)+住所(購入者)
                     "ご依頼主アパートマンション",
                     "ご依頼主名",// 固定 or 氏(購入者)+名(購入者)
                     "ご依頼主名(ｶﾅ)",
                     "品名コード１",
                     "品名１",// 固定 （アイテム名をプラス？） TODO
                     "品名コード２",
                     "品名２",
                     "荷扱い１",
                     "荷扱い２",
                     "記事",
                     "コレクト代金引換額（税込)",
                     "コレクト内消費税額等",
                     "止置き",
                     "営業所コード",
                     "発行枚数",
                     "個数口表示フラグ",
                     "請求先顧客コード",
                     "請求先分類コード",
                     "運賃管理番号",
                     "クロネコwebコレクトデータ登録",
                     "クロネコwebコレクト加盟店番号",
                     "クロネコwebコレクト申込受付番号１",
                     "クロネコwebコレクト申込受付番号２",
                     "クロネコwebコレクト申込受付番号３",
                     "お届け予定ｅメール利用区分",
                     "お届け予定ｅメールe-mailアドレス",
                     "入力機種",
                     "お届け予定ｅメールメッセージ",
                     "お届け完了ｅメール利用区分",
                     "お届け完了ｅメールe-mailアドレス",
                     "お届け完了ｅメールメッセージ",
                     "クロネコ収納代行利用区分",
                     "予備",
                     "収納代行請求金額(税込)",
                     "収納代行内消費税額等",
                     "収納代行請求先郵便番号",
                     "収納代行請求先住所",
                     "収納代行請求先住所（アパートマンション名）",
                     "収納代行請求先会社・部門名１",
                     "収納代行請求先会社・部門名２",
                     "収納代行請求先名(漢字)",
                     "収納代行請求先名(カナ)",
                     "収納代行問合せ先名(漢字)",
                     "収納代行問合せ先郵便番号",
                     "収納代行問合せ先住所",
                     "収納代行問合せ先住所（アパートマンション名）",
                     "収納代行問合せ先電話番号",
                     "収納代行管理番号",
                     "収納代行品名",
                     "収納代行備考",
                     "複数口くくりキー",
                     "検索キータイトル1",
                     "検索キー1",
                     "検索キータイトル2",
                     "検索キー2",
                     "検索キータイトル3",
                     "検索キー3",
                     "検索キータイトル4",
                     "検索キー4",
                     "検索キータイトル5",
                     "検索キー5",
                     "予備",

                     "投函予定メール利用区分",
                     "投函予定メールe-mailアドレス",
                     "投函予定メールメッセージ",
                     "投函完了メール（お届け先宛）利用区分",
                     "投函完了メール（お届け先宛）e-mailアドレス",
                     "投函完了メール（お届け先宛）メールメッセージ",
                     "投函完了メール（ご依頼主宛）利用区分",
                     "投函完了メール（ご依頼主宛）e-mailアドレス",
                     "投函完了メール（ご依頼主宛）メールメッセージ"];

  let messageArea;
  let warningArea;
  let errorArea;
  let downloadArea;
  const readSjisFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const resultStr = encoding.convert(data, { to: 'UNICODE', from: 'SJIS', type: 'string' });
        resolve(resultStr);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  const log = (str, target) => {
    const m = document.createElement('p');
    m.innerHTML = str;
    target.appendChild(m);
    target.style.display = "block";

  }

  const logError = (str) => {
    console.error(str);
    log(str, errorArea);
  };

  const message = (str) => {
    console.log(str);
    log(str, messageArea);
  };

  const warning = (str) => {
    console.warn(str);
    log(str, warningArea);
  }

  const parseCsv = (csv) => {
    const delimiter = ",";
    const objPattern = new RegExp(
      (
        // delimiters
        "(\\" + delimiter + "|\\r?\\n|\\r|^)" +
          // quoted fields
        "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
          // fields
        "([^\"\\" + delimiter + "\\r\\n]*))"
      ),
      "gi"
    );


    const parsedCsv = [[]];
    let matches = null;
    while (matches = objPattern.exec(csv)) {
      const matchedDelimiter = matches[1];
      if (
        matchedDelimiter.length &&
          matchedDelimiter !== delimiter
      ) {
        parsedCsv.push([]);
      }

      let matchedValue;
      if (matches[2]) {
        matchedValue = matches[2].replace(
          new RegExp("\"\"", "g"),
          "\""
        );
      } else {
        matchedValue = matches[3];
      }
      parsedCsv[parsedCsv.length - 1].push(matchedValue);
    }

    return parsedCsv;
  }

  const createJsonFromCsv = (str) => {
    const table = parseCsv(str.trim());
    const header = table.shift();
    return table.map((line, index) => {
      if (line.length != header.length) {
        logError(`正いcsvではありません: index: ${index} 項目数 ${line.length}, 必要な項目数 ${header.length}, ${line}`);
        return {};
      }
      return header.reduce((acc, current, index) => {
        acc[current] = line[index];
        return acc;
      }, {});
    });
  }


  const checkAddress = (json) => {
    if (json['電話番号(配送先)'] === json['電話番号(購入者)'] &&
        json['郵便番号(配送先)'] === json['郵便番号(購入者)'] &&
        json['都道府県(配送先)'] === json['都道府県(購入者)'] &&
        json['住所(配送先)'] === json['住所(購入者)'] &&
        json['氏(配送先)'] === json['氏(購入者)'] &&
        json['名(配送先)'] === json['名(購入者)']) {
      return "same";
    }
    return "differ";
  };

  const splitAddress = (address) => {
    const a = address.normalize();
    let pos = a.search(/第[一二三四五六七八九1-9１-９]/);
    if (pos <= 0)
      pos = a.search(/[ァ-ヴ][ァ-ヶ\-ー]/);
    if (pos > 0) {
      return [a.substring(0, pos), a.substring(pos)];
    } else {
      return [a, ''];
    }
  };

  const generateB2Cdata = (json, index) => {
    const c = checkAddress(json) === "same";
    const data = {};
    data["送り状種類"] = document.querySelector('#sendKind').value;
    data["クール区分"] = document.querySelector('#cool').value;
    data["出荷予定日"] = document.querySelector('#sendDate').value;
    data["配送時間帯"] = '';
    data["お届け先電話番号"] = json["電話番号(配送先)"];
    data["お届け先郵便番号"] = json["郵便番号(配送先)"];
    data["お届け先名"] = [json["氏(配送先)"],json["名(配送先)"]].join(' ');
    {
      const a = splitAddress([json["都道府県(配送先)"], json["住所(配送先)"]].join(''));
      data["お届け先住所"] = a[0];
      data["お届け先アパートマンション名"] = a[1];
    }

    if (document.querySelector('#useScheduleEmail').checked) {
      data["お届け予定ｅメール利用区分"] = 1;
      data["お届け予定ｅメールe-mailアドレス"] = json["メールアドレス"];
      data["お届け予定ｅメールメッセージ"] = document.querySelector('#scheduleEmailMessage').value;
    }

    data["ご依頼主電話番号"] = c ? document.querySelector('#senderTel').value : json["電話番号(購入者)"];
    data["ご依頼主郵便番号"] = c ? document.querySelector('#senderZip').value : json["郵便番号(購入者)"];
    {
      const a = splitAddress([json["都道府県(購入者)"], json["住所(購入者)"]].join(''));
      data["ご依頼主住所"] = c ? document.querySelector('#senderAddress').value : a[0];
      data["ご依頼主アパートマンション"] = c ? document.querySelector('#senderAddress2').value : a[1];
    }
    data["ご依頼主名"] = c ? document.querySelector('#senderName').value :[json["氏(購入者)"],json["名(購入者)"]].join(' ');
    data["品名１"] = document.querySelector('#contentsName').value;

    data["荷扱い１"] = document.querySelector('#handling1').value;
    data["荷扱い２"] = document.querySelector('#handling2').value;
    
    data["請求先顧客コード"] = document.querySelector('#customerId').value
    data["請求先分類コード"] = document.querySelector('#customerKind').value
    data["運賃管理番号"] =  document.querySelector('#fareId').value
    if (json["備考"]) {
      message(`${index + 1}行目 ${[json["氏(購入者)"],json["名(購入者)"]].join(' ')}さんのメッセージがあります<br />
${json['備考']}`);
    }
    if (json["ステータス"] !== "未発送") {
      if (json["ステータス"] == "入金待ち") {
        warning(`${index + 1}行目 ${[json["氏(購入者)"],json["名(購入者)"]].join(' ')}さんの注文ステータスが未発送ではなく${json["ステータス"]}ですが、変換を実行します。`);
      } else {
        logError(`${index + 1}行目 ${[json["氏(購入者)"],json["名(購入者)"]].join(' ')}さんの注文ステータスが未発送ではなく${json["ステータス"]}です。`);
        return null;
      }
    }
    return data;
  };

  const createCsv = (data) => {
    const csvText = data.map(entry =>
                             b2Headers.map(h => {
                               if (entry[h] == null) {
                                 return '""';
                               } else {
                                 return `"${entry[h]}"`;
                               }
                             }).join(',')
                            ).join("\n");
    return [b2Headers.map(h => `"${h}"`).join(","), csvText].join("\n");
  };

  const createDownloadFor = (text) => {
    const blob = new Blob([text], { "type" : "text/csv" });
    document.querySelector('#download-link').href = window.URL.createObjectURL(blob);
    document.querySelector('#download').style.display = "block";
  };

  const clearResult = () => {
    messageArea.innerHTML = '<h3>情報</h3>';
    messageArea.style.display = 'none';
    warningArea.innerHTML = '<h3>警告</h3>';
    warningArea.style.display = 'none';
    errorArea.innerHTML = '<h3>エラー</h3>';
    errorArea.style.display = 'none';
    downloadArea.style.display = 'none';
  }

  const generateB2CdataTable = (jsons) => {
    const orderIdHash = {};
    const d = jsons.map((json, index) => {
      const r = generateB2Cdata(json, index);
      const orderId = json['オーダー番号'];
      const dup = orderIdHash[orderId];
      if (dup) {
        if (JSON.stringify(dup) !== JSON.stringify(r)) {
          logError(`オーダー番号 ${orderId}の注文が複数ありますが、内容が食い違っています。`);
          logError(`お届け先${r['お届け先名']}として出力しますが、お届け先${dup['お届け先名']}と同一のオーダー番号です。`);
          return r;
        }
        return null;
      } else  {
        orderIdHash[orderId] = r;
      }
      return r;
    });
    return d.filter(entry => entry !== null);
  }

  const handleCsvInput = async () => {
    clearResult();
    const file = document.querySelector('#inputCsv').files[0];
    const csv = await readSjisFile(file);
    const jsons = createJsonFromCsv(csv);
    const data = generateB2CdataTable(jsons);
    if (data.includes(null)) {
      logError('入力csvに問題がありました。処理を中止します。');
      return;
    }
    const csvText = createCsv(data);
    createDownloadFor(csvText);
  };

  const fetchDefault = async () => {
    return new Promise((resolve, _) => {
      fetch('./default-data.json').then(response => {
        return response.json();
      }).then(json => {
        resolve(json);
      }).catch(error => {
        logError('デフォルト値が読み込めませんでした');
        logError(error);
        resolve({});
      });
    });
  }

  const handleDefault = async () => {
    const defaultValues = await fetchDefault();
    Object.keys(defaultValues).forEach(key => {
      const element = document.querySelector(`#${key}`);
      if (element) {
        if (element.type === 'checkbox') {
          element.checked = (defaultValues[key] === true);
        } else {
          element.value = defaultValues[key];
        }
      } else {
        error(`default-data.json内のキー ${key}は無効です`);
      }
    });
  };


  messageArea = document.querySelector('#message');
  warningArea = document.querySelector('#warning');
  errorArea = document.querySelector('#error');
  downloadArea = document.querySelector('#download');
  const execButton = document.querySelector('#exec');
  execButton.addEventListener('click', handleCsvInput);
  document.querySelector('#inputCsv').addEventListener('change', () => {
    if (execButton.disabled) {
      execButton.disabled = '';
    } else {
      clearResult();
    }
  });
  handleDefault();
}
