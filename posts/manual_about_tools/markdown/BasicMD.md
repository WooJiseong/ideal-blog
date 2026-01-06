---
type: "post"
title: "MarkDown Basic"
date: "2026-01-03"
tags: ["Markdown", "BasicMD"]
---

How To Write Markdown {#how-to-write-markdown}
===
I. Title
---
1. #의 개수에 따라 제목의 표현 가능
2. \#을 통한 Heading에는 총 6단계 존재 <br> \<h1\> ~ \<h6\> _[Detail]_ \<\h1\> ~ \<\h6\>과 동일 
> # Heading Lv1 <br>
> ## Heading Lv2 <br>
> ### heading Lv3 <br>
> #### heading Lv4 <br>
> ##### heading Lv5 <br>
> ###### heading Lv6 <br>
> Normal String

4. ===,---로도, 제목의 표현 가능 <br>
  + 단순 ---, ___, ***는 Horizontal (문단띠) 의 용도
---
***
___

II. Block
---
1. '>'를 이용하여, 인용문 작성 가능
> 이르케
>> 2중 인용도 가능
> + end

III. Indexing
---
1. 순서가 있는 목록은, 숫자와 마침표로 표기 (Ex : 1.)
4. 숫자가 연속적이지 않아도, 알아서 연속된 숫자로 표기해줌
2. 숫자가 뒤죽박죽이어도 마찬가지인거같음 (왜...?)

+ 순서가 없는 항목은, (+,*,-)등을 이용해 표시 <br>
  - 이런 <br>
    * 식으로 <br>
      + 인덱싱 <br>
  - 이거도 가능 <br>

IV. Line Break
---
>1. \<br>을 이용해 Line Break<br>  
Or 2 Space + Enter<br>

>2 Enter = 단락 바꿈<br>

V. HighLight
---
> \*,\_를 통한 하이라이트<br>
*\*이탤릭\** , **\*\*볼드\*\*** , ***\*\*\*둘 다 가능\*\*\****<br>

> ~ 를 이용한 취소선 (~~ 직전, 직후에 띄어쓰기가 존재하면 미적용 ~~) <br> ~~\~\~이런 방식으로\~\~~~<br>

> \` (Apostrophe)를 통한 글상자<br>

`이런 식의 글상자 만들기 가능` (사실 이건 Code 기능임)<br>
> 이런 식으로 SuperScript와, SubScript를 넣을 수 있음
X<sup>2</sup>, H<sub>2</sub>O


VI. Escape Sequence
--- 
>\> 특수문자 츨력을 위해선 '\\' 문자를 앞에 붙여서 출력 <br>
>> '[]'의 경우, 일반적으로 사용할 경우엔, 단순 대괄호 \\[ \\]는 \$\$ \$\$와 동치로, 
\[LaTeX\] 문법이다.<br>

VII. Link
---
> \[내용]\(주소) 방식으로 표기 (HTML 변환 위해 ' '은 %20, ()는 %28 %29로 표시)
  [MD Official Guide](https://www.markdownguide.org)
  \<https://www.markdownguide.org\> 방식으로 직접 표현도 가능
  [md][1] 이런 식으로 주소 관리도 가능

[1]: https://en.wikipedia.org/wiki/Hobbit#Lifestyle


>내부 Link의 경우,
\[title](#head Name)의 방식으로 작성
[Goto Title](#how-to-write-markdown)
안정적으로 이동하기 위해선, 링크 대상이 되는 헤더에 Custom Header 추가
{#custom_header} [goto Image Part](#custom_header)<br>

VIII. Image {#custom_header}
---
> ![image](./_asset/MD_mark.png) 단, 위 방식은 크기 조절이 불편함
>> <img src = ./_asset/NGGYU.gif width = "25%">
>> <img src = ./_asset/NGGYU.gif width = "25%"> 이미지는 Html 코드가 좋은듯
<video>
  <source src="./_asset/Rick_roll.mp4" controls></source>
</video>

IX. Coding 
---
> \```, ~~~를 통해 코드 작성 가능 *(뒤에 언어를 작성하여 하이라이팅)*
``` C
#include <stdio.h>
int main(){
  printf("%s","hello, MD!");
  return 0;
}
```
~~~ python
import numpy as np
print('Hello, MD!')
~~~
> 만약 문맥 중 언급해야될 때는 `printf()` 이런 식으로 작성 <br> 

X. Table 
---
> |Header|
  |Align|
  |Cell|의 방식으로 표 제작

|헤더1|헤더2|헤더3|헤더4|헤더5|
|---|:---:|---:|:---|---|
|기본 왼정렬|중앙정렬|오른정렬|왼정렬|으로 정렬|
|1|`2`|3|4|5|
> Table 내 |는, \&#124; 코드로 보일 수 있음

XI. Footnotes
---
> 각주 사용을 위한 방식[^custom] <br>

Here's a simple footnote,[^1] and here's a longer one.[^bignote]

[^1]: This is the first footnote.

[^bignote]: Here's one with multiple paragraphs and code.

    Indent paragraphs to include them in the footnote.

    `{ my code }`

    Add as many paragraphs as you like.

[^custom]: 각주명이랑은 연관 없이 순서에만 연관됨 (footnote 순서로 본문 순서 따라서 적용)