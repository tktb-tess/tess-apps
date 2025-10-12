# tess-apps

色々なアプリ置き場。

## ローカルサーバーの起動

```bash
git clone https://github.com/tktb-tess/tess-apps.git
cd tess-apps
npm i
npm run dev
```

## 人工言語ガチャ

[https://github.com/tktb-tess/conlang_gacha](https://github.com/tktb-tess/conlang_gacha) より移動。

### 説明

かえるさん (kaeru2193) のリポジトリ [人工言語リスト 処理用プログラム群](https://github.com/kaeru2193/Conlang-List-Works) に置いてある、  
人工言語学Wiki「日本語圏の人工言語一覧」のリストから生成している Cotec 形式データ `conlinguistics-wiki-list.ctc`  
を取得して加工したデータ ([GitHub Pages](https://tktb-tess.github.io/cotec/json/data)) を利用し、その中の人工言語をランダムで一つ表示するガチャです。

Cotec形式については [こちら](https://migdal.jp/cl_kiita/cotec-conlang-table-expression-powered-by-csv-clakis-rfc-2h86) を読んでください。

### 更新履歴

- 2025/10/13
  - フォント設定の変更 etc.

- v2.0.2
  - Cotec-JSON 仕様変更に伴い修正
  - 初回の非表示の表がクリックできてしまっていたのを修正

- v2.0.1
  - 前回結果保持機能を追加
  - テーブルの項目に一部ダブりがあったのを修正

- v2.0.0
  - ドメインを移動
  - SPAからフレームワーク (Next.js) に移植
  - 現在ガチャ保存機能はない (今後実装予定)

これより前の履歴は[こちら](https://github.com/tktb-tess/conlang_gacha/blob/main/README.md)を参照のこと。

## コンマ検索

Xenharmonic wiki の [Unnoticeable comma](https://en.xen.wiki/w/Unnoticeable_comma), [Small comma](https://en.xen.wiki/w/Small_comma), [Medium comma](https://en.xen.wiki/w/Medium_comma), [Large comma](https://en.xen.wiki/w/Large_comma) の4記事に載っているコンマを取得・加工したデータ ([GitHub Pages](https://tktb-tess.github.io/commas)) を利用して、コンマを検索できるようにしたものです。

### 更新履歴

- v1.0.2
  - タイトルアニメーションを追加
  - Xenharmonic wiki の各コンマページへのリンクを追加
  - 緩和する平均律の項を折り畳みできるように
  - 表示の手直し
  - 悠久肆方体へのリンク追加

- v1.0.1
  - 無理数コンマのセント値の表示対応
  - 無理数コンマの詳細ページが見れるように対応

- v1.0.0
  - 正式リリース
