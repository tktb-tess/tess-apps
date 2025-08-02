# tess-apps

色々なアプリ置き場。

## 開発サーバーの起動

```bash
git clone https://github.com/tktb-tess/tess-apps.git
cd tess-apps
npm i
npm run dev
```

## 人工言語ガチャ

`v2.0.0`

[https://github.com/tktb-tess/conlang_gacha](https://github.com/tktb-tess/conlang_gacha) より移動。

### 説明

かえるさん (kaeru2193) のリポジトリ [人工言語リスト 処理用プログラム群](https://github.com/kaeru2193/Conlang-List-Works) に置いてある、  
人工言語学Wiki「日本語圏の人工言語一覧」のリストから生成している Cotec 形式データ `conlinguistics-wiki-list.ctc`  
を取得し、その中の人工言語をランダムで一つ表示するガチャです。

Cotec形式については [こちら](https://migdal.jp/cl_kiita/cotec-conlang-table-expression-powered-by-csv-clakis-rfc-2h86) を読んでください。

### 更新履歴

- v2.0.0
  - ドメインを移動
  - SPAからフレームワーク (Next.js) に移植
  - 現在ガチャ保存機能はない (今後実装予定)

これより前の履歴は[こちら](https://github.com/tktb-tess/conlang_gacha/blob/main/README.md)を参照のこと。
