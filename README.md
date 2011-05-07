teritori
=============
A bookmarklet for generating static HTML codes for tweets

これは何？
-------

[teritori][1]は、Twitterのツイート等を任意のサイトに埋め込むための静的なHTMLコードを生成するブックマークレットです。

同じ用途のブックマークレットとしては、Xavier Damman氏（ [@xdamman][2] ）の[publitweet Blackbird bookmarklet][3]や、それをIppei Suzuki氏（ [@nobodyplace][4] ）が日本時間に対応させた[日本時間対応版][5]が既にありますし、私（ Masami HIRATA [@msmhrt][6] ）もそれらに些細な変更を加えたバージョンを[公開][7]していました。

しかし、publitweet Blackbird bookmarkletの作者であるXavier氏にライセンスの種類を問い合わせたところ、はっきりとした回答をいただくことができなかったという事情から、MITライセンスで一から書き直したのがteritoriです。

使い方
-------

1. teritoriをブックマークツールバーに登録します。
    [teritori][1]のページから[teritoriの最新版][8]をダウンロードしたら、同梱の index.htmlをWebブラウザで開き、「teritori」のリンクをブックマークバーにドラッグアンドドロップしてください。
    同ページ内の「teritori_profile」は、Twitterのユーザープロフィール用、「teritori_kml」は、Googleマップのマーカーの説明文用にカスタマイズされたバージョンです。
	
2. 静的なHTMLコードを生成したいツイートを探します。
    Webブラウザで静的なHTMLコードを生成したいツイートを探し、そのツイートの個別ページを開いてください。

3. teritoriを実行します。
    ブックマークツールバー上のブックマークレットをクリックするだけです。
    中央にダイアログが表示され、teritoriがツイートから静的なHTMLコードを生成して表示します。
    ダイアログが表示されなかった場合は、タイムライン上のツイートにマウスカーソルをあててみてください。
    「返信」の右側に「GetHTML」というリンクがあれば、それがteritori用のリンクです。

4. 表示されたHTMLコードをコピーアンドペーストして、ツイートを表示したいサイトに埋め込みます。
    これで作業は完了です。

Gist
-------

ブックマークレットは Gistの [teritori] [9]、[teritori_profile][10]、[teritori_kml][11]でも公開しています。内容はindex.htmlに含まれているのと同じ物ですが、ブックマークレットの登録に慣れていらっしゃる方は、こちらからどうぞ。

動作環境
-------

動作を確認済みのブラウザ環境は、Mac OS X版のGoogle Chromeの最新版です。
他の環境については現在確認中ですが、何か問題がありましたら、下記の連絡先に知らせていただければ善処します。

ライセンス
-------

MITライセンスとします。

謝辞
-------

素晴らしいブックマークレットを公開してくださった Xavier Damman氏に感謝を。
そして、日本語日時表示版を作成してくださった Ippei Suzuki氏にもお礼を。

連絡先
-------

 - Email: msmhrt AT gmail.com
 - Twitter: [@msmhrt][6]
 - Facebook: [Masami HIRATA][12]

[1]: https://github.com/msmhrt/teritori
[2]: http://twitter.com/xdamman
[3]: http://publitweet.com/blog/2010/05/05/blackbird-bookmarklet-publish-a-tweet-in-html/
[4]: http://twitter.com/nobodyplace
[5]: http://nplll.com/archives/2011/03/tweetblackbird_piebookmarklet.php
[6]: http://twitter.com/msmhrt
[7]: https://github.com/msmhrt/b4
[8]: https://github.com/msmhrt/teritori/archives/master
[9]: https://gist.github.com/922908
[10]: https://gist.github.com/922909
[11]: https://gist.github.com/922910
[12]: http://www.facebook.com/msmhrt