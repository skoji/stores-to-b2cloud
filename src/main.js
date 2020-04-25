const encoding = require('encoding-japanese');

const b2Headers = ["お客様管理番号", "送り状種類", "クール区分", "伝票番号", "出荷予定日", "お届け予定日", "配達時間帯", "お届け先コード", "お届け先電話番号", "お届け先電話番号枝番", "お届け先郵便番号", "お届け先住所", "お届け先アパートマンション名", "お届け先会社・部門１", "お届け先会社・部門２", "お届け先名", "お届け先名(ｶﾅ)", "敬称", "ご依頼主コード", "ご依頼主電話番号", "ご依頼主電話番号枝番", "ご依頼主郵便番号", "ご依頼主住所", "ご依頼主アパートマンション", "ご依頼主名", "ご依頼主名(ｶﾅ)", "品名コード１", "品名１", "品名コード２", "品名２", "荷扱い１", "荷扱い２", "記事", "ｺﾚｸﾄ代金引換額（税込)", "000円以下　1円以上", "000円以下　　1円以上", "内消費税額等", "止置き", "営業所コード", "発行枚数", "個数口表示フラグ", "請求先顧客コード", "請求先分類コード", "運賃管理番号", "クロネコwebコレクトデータ登録", "クロネコwebコレクト加盟店番号", "クロネコwebコレクト申込受付番号１", "クロネコwebコレクト申込受付番号２", "クロネコwebコレクト申込受付番号３", "お届け予定ｅメール利用区分", "お届け予定ｅメールe-mailアドレス", "入力機種", "お届け予定ｅメールメッセージ", "お届け完了ｅメール利用区分", "お届け完了ｅメールe-mailアドレス", "お届け完了ｅメールメッセージ", "クロネコ収納代行利用区分", "予備", "収納代行請求金額(税込)", "収納代行内消費税額等", "収納代行請求先郵便番号", "収納代行請求先住所", "収納代行請求先住所（アパートマンション名）", "収納代行請求先会社・部門名１", "収納代行請求先会社・部門名２", "収納代行請求先名(漢字)", "収納代行請求先名(カナ)", "収納代行問合せ先名(漢字)", "収納代行問合せ先郵便番号", "収納代行問合せ先住所", "収納代行問合せ先住所（アパートマンション名）", "収納代行問合せ先電話番号", "収納代行管理番号", "収納代行品名", "収納代行備考", "複数口くくりキー", "検索キータイトル1", "検索キー1", "検索キータイトル2", "検索キー2", "検索キータイトル3", "検索キー3", "検索キータイトル4", "検索キー4", "検索キータイトル5", "検索キー5", "予備", "予備", "投函予定メール利用区分", "投函予定メールe-mailアドレス", "投函予定メールメッセージ", "投函完了メール（お届け先宛）利用区分", "投函完了メール（お届け先宛）e-mailアドレス", "投函完了メール（お届け先宛）メールメッセージ", "投函完了メール（ご依頼主宛）利用区分", "投函完了メール（ご依頼主宛）e-mailアドレス", "投函完了メール（ご依頼主宛）メールメッセージ"];

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

const error = (str) => {
  // TODO: display error on page;
  console.log(str);
};

const cleanEntry = (entry) => entry.trim().replace(/^"/, '').replace(/"$/, '');


const createJsonFromCsv = (str) => {
  const table = str.split("\n").filter(line => { return line.trim().length > 0; });
  const header = table.shift().split(',').map(x => cleanEntry(x));
  return table.map(l => {
    const line = l.split(',').map(x => cleanEntry(x));
    if (line.length != header.length) {
      error(`not consistent: ${line.length}, ${header.length}, ${line}`);
      return {};
    }
    return header.reduce((acc, current, index) => {
      acc[current] = line[index];
      return acc;
    }, {});
  });
}

const handleCsvInput = async (e) => {
  const file = e.target.files[0];
  const csv = await readSjisFile(file);
  const json = createJsonFromCsv(csv);
  const message = document.querySelector('#message');
  message.innerHTML = JSON.stringify(json);
  message.style.display = "block";
};


window.onload = () => {
  document.querySelector('#inputCsv').addEventListener('change', handleCsvInput);
}
