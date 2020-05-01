const encoding = require('encoding-japanese');

window.onload = () => {

  // TODO: 配達時間帯と備考のチェック
  // TODO: 「ステータス」行をチェックする。未発送のみ対象？
  
  const b2Headers = ["お客様管理番号",
                     "送り状種類", // 0 : 発払い 3 : ＤＭ便 4 : タイム 5 : 着払い 7 : ネコポス 8 : 宅急便コンパクト
                     "クール区分", // 0：通常 1:クール冷蔵 2:クール冷凍
                     "伝票番号",
                     "出荷予定日",　// 毎回
                     "お届け予定日",
                     "配達時間帯", // TODO
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
                     "品名１",// 固定 （アイテム名をプラス？）
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
  let errorArea;

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
    console.log(str);

    const m = document.createElement('p');
    m.innerHTML = str;
    target.appendChild(m);
    target.style.display = "block";
    
  }

  const error = (str) => {
    console.log(errorArea);    
    log(str, errorArea);
  };

  const message = (str) => {
    console.log(messageArea);
    log(str, messageArea);
  };

  const cleanEntry = (entry) => entry.trim().replace(/^"/, '').replace(/"$/, '');

  const createJsonFromCsv = (str) => {
    const table = str.split("\n").filter(line => { return line.trim().length > 0; });
    const header = table.shift().split(',').map(x => cleanEntry(x));
    return table.map(l => {
      const line = l.split(',').map(x => cleanEntry(x));
      if (line.length != header.length) {
        error(`正いcsvではありません: 項目数 ${line.length}, 必要な項目数 ${header.length}, ${line}`);
        return {};
      }
      return header.reduce((acc, current, index) => {
        acc[current] = line[index];
        return acc;
      }, {});
    });
  };

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
    const pos = a.search(/[ァ-ン][ァ-ン\-]/);
    if (pos > 0) {
      return [a.substring(0, pos), a.substring(pos)];
    } else {
      return [a, ''];
    }
  };
  
  const generateB2Cdata = (json) => {
    //    const c = checkAddress(json) === "same";
    const c = false; // TODO 
    const data = {};
    data["送り状種類"] = 0; // 発払い TODO: 設定可能にするべき
    data["クール区分"] = ''; // 通常 TODO: 設定可能にするべき
    data["出荷予定日"] = document.querySelector('#sendDate').value;
    data["配送時間帯"] = ''; // TODO
    data["お届け先電話番号"] = json["電話番号(配送先)"];
    data["お届け先郵便番号"] = json["郵便番号(配送先)"];
    data["お届け先名"] = [json["氏(配送先)"],json["名(配送先)"]].join(' ');
    {
      const a = splitAddress([json["都道府県(配送先)"], json["住所(配送先)"]].join(''));
      data["お届け先住所"] = a[0];
      data["お届け先アパートマンション名"] = a[1];
    }

    // TODO : デフォルト依頼主、設定可能にすべき
    data["ご依頼主電話番号"] = c ? '' : json["電話番号(購入者)"];
    data["ご依頼主郵便番号"] = c ? '' : json["郵便番号(購入者)"];
    {
      const a = splitAddress([json["都道府県(購入者)"], json["住所(購入者)"]].join(''));
      data["ご依頼主住所"] = c ? '' : a[0];
      data["ご依頼主アパートマンション"] = c ? '' : a[1];      
    }
    data["ご依頼主名"] = [json["氏(購入者)"],json["名(購入者)"]].join(' ');

    data["品名１"] = "菓子";
    data["請求先顧客コード"] = ''; // TODO; 設定
    data["運賃管理番号"] = '01'; // TODO; 設定
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
  
  const handleCsvInput = async (e) => {
    const file = e.target.files[0];
    const csv = await readSjisFile(file);
    const jsons = createJsonFromCsv(csv);
    const data = jsons.map(json => generateB2Cdata(json));
    const csvText = createCsv(data);
    createDownloadFor(csvText);
  };


  messageArea = document.querySelector('#message');
  errorArea = document.querySelector('#error');
  document.querySelector('#inputCsv').addEventListener('change', handleCsvInput);

}
