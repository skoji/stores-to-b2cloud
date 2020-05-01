# Stores to B2Cloud

STORESのオーダーcsvを、ヤマト運輸B2Cloudの送り状基本レイアウトcsvに変換します。データカスタマイズ後、Webサーバへの設置が必要です。
全ての処理はブラウザ側で行われるので、顧客データがWebに流れる心配がありません。また、ローカルPCのWebサーバでも問題なく動作します。

![](stores-to-b2cloud.png)

## 特徴

オーダーcsvからB2クラウドのレイアウト変更は、B2クラウドの紐付け機能でもできますが、このプログラムでは以下のことができます。

* 「依頼主」を原則として事業者に設定できる。STORES「ギフト」で購入されたものは、購入者が依頼主に設定される。
* 読み込み時に、STORESのオーダーで「備考」があった場合は、メッセージとして表示する。

## 問題点

STORESの住所情報は、B2クラウドの情報ほど細かく分かれていません。このため、「アパート・マンション名」が正しく抽出できません。
カタカナが2文字以上続く場所から後を「アパート・マンション名」とみなして分割しますが、カタカナではないアパート名などでは問題が発生します。

B2クラウドで読み込み後に修正してください。

## ビルド

`npm install && npm run build`

## 設定

`default-data.json`を用意します。`dafault-data-template.json`をもとにしてください。

``` json
{
  "senderZip" : "1000001",
  "senderAddress" : "東京都千代田区千代田1-1-1",
  "senderAddress2" : "山田荘101",
  "senderTel" : "090-1111-1111",
  "senderName" : "山田たろう",
  "customerId" : "1234567890",
  "contentsName" : "計算機",
  "customerKind" : "",
  "fareId" : "01",
  "cool" : 0,
  "sendKind" : 0
}
```

* `sender`で始まる要素は、デフォルトの依頼人です。
* `contentsName`は品名にはいります。（STORESのアイテム名は今は反映させていません）
* `customerId`は、B2クラウドの顧客コードです。
* `customerKind`は、B2クラウドの請求先分類コードです。
* `fareId`は、B2クラウドの運賃管理番号です。
* `cool`はクール便区分です。0：通常 2:クール冷蔵 1:クール冷凍
* `sendKind`は送り状種類です。0 : 発払い 3 : ＤＭ便 4 : タイム 5 : 着払い 7 : ネコポス 8 : 宅急便コンパクト

## 設置

Webサーバ上の適切な場所に、`index.html`、`build/index.js`、`default-data.config`を設置してください。
rsyncを使う場合は、`deploy-template.sh`も参考になるでしょう。

## 使い方

ページを開き、「入力ファイル」に、STORESからダウンロードしたオーダーcsvを指定します。その他の設定を必要に応じて変更した上で、下の「変更」を押してください。
その下に、「B2クラウド用csvダウンロード」のリンクが現れます。STORESオーダーで備考に書かれていることがあれば、その下の領域に表示されます。

ダウンロードしたcsvを、「送り状発行システムB2クラウド」の「外部データから発行」で、「基本レイアウト(csv)」を選択した上で、アップロードしてください。
「取り込み開始行」は2行目です。

## ライセンスなど

* [encoding.js](https://github.com/polygonplanet/encoding.js/)を使っています。（encoding.jsの[ライセンスはMIT](https://github.com/polygonplanet/encoding.js/blob/master/LICENSE)です）
* 単純なコードで、改造は簡単だと思います。必要があればforkして変えていってください。
* AGPL3.0であることにご留意ください。万が一別のライセンスをご希望の場合は[skoji@skoji.jp](mailto:skoji@skoji.jp)までお問い合わせください。




