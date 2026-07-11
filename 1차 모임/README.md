26 하계 모각소 1차 모임 기록 
일시 - 2026.07.11

개인주제 - APK/IPA 파일 구조 이해, FridaLab를 통한 후킹 연습

1. APK/IPA 파일 구조 이해
    1. APK 파일 구조
    APK 파일은 안드로이드 앱을 배포 및 설치하기 위한 패키지이다. 기본적으로 ZIP 형태로 되어 있어, 이를 압축 해제하면 앱 설정, 리소스, 서명 정보 등 앱 구동에 필요한 요소가 포함되어 있다.
        
        APK 압축을 해제하면 확인할 수 있는 구조는 다음과 같다.
        
        1. AndroidManifest.xml : 패키지명, 권한, 컴포넌트(Activity, Service 등)담고 있는 파일
        2. classes.dex: Java 클래스가 dex로 변환된 실제 실행 코드, 앱이 크면 classes2.dex, classes3.dex처럼 멀티덱스로 분할됨 
        3. res: 리소스ID로 접근하는 레이아웃, 문자열 등 XML 형태의 리소스 
        4. assets: 파일 경로로 직접 접근하는 데이터베이스, 모델 파일 등
        5. lib: arm64-v8a, x86_64 등 아키텍쳐별 네이티브 라이브러리(.so 파일) 저장
        6. META-INF: 앱의 무결성 확인을 위한 서명 정보
  
    2. IPA 파일 구조
        
        IPA 파일은 iOS/iPadOS 앱을 배포 및 설치하기 위한 패키지이다. 기본적으로 ZIP 형태로 되어 있어, 이를 압축해제하면 앱 실행 데이터, 메타데이터 등이 포함되어있다.
        
        IPA 압축을 해제하면 확인할 수 있는 구조는 다음과 같다.
        
        1. Payload: 앱의 핵심 데이터가 포함되는 최상위 디렉터리
        2. Application.app: iOS 앱의 Mach-O 실행 바이너리, Info.plist(앱 설정), 이미지/사운드 등 리소스 포함. Mach-O 바이너리가 리버싱 주요 분석 대상 
        3. iTunesArtwork / iTunesArtwork@2x: App Store/iTunes에서 표시되는 앱 아이콘
        4. iTunesMetadata.plist: 개발자/번들ID/저작권/앱 정보 등 메타데이터
        5. WatchKitSupport/WK: Apple Watch 앱 지원 관련 폴더 (존재하는 경우에만)
        6. META-INF: IPA 생성 도구 관련 메타데이터 | * IPA 서명정보는 META-INF가 아닌 _codeSignature 폴더에 저장됨 

[참고자료]

[https://tech-carrot.tistory.com/entry/안드로이드-APK-구조](https://tech-carrot.tistory.com/entry/%EC%95%88%EB%93%9C%EB%A1%9C%EC%9D%B4%EB%93%9C-APK-%EA%B5%AC%EC%A1%B0)

https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=ilikebigmac&logNo=221466806806

https://skytitan.tistory.com/585 

---

2. FridaLab를 통한 후킹 연습

Frida는 macOS, Android, iOS 등 다양한 플랫폼의 애플리케이션에 후킹을 수행할 수 있도록 설계된 도구. 단순한 함수 후킹 외에도 암호화/복호화 루틴 추적, 실시간 트래픽 스니핑 등 고급 기능을 수행할 수 있는 도구 

따라서 Frida를 쉽게 연습할 수 있도록 하는 앱인 FridaLab을 사용하여 연습을 진행한다. 

### challenge_01

```java
package uk.rossmarks.fridalab;

/* JADX INFO: loaded from: classes.dex */
public class challenge_01 {
    static int chall01;

    public static int getChall01Int() {
        return chall01;
    }
}
```

일단 jadx를 통해 FridaLab.apk를 디컴파일하면 sourcecode/uk.rossmarks.fridalab/challenge_01에 다음과 같은 코드를 확인할 수 있다.

해당 코드는 chall01의 정적 변수를 선언하고 getChall01Int() 메서드를 통해 값을 반환한다.

sourcecode/uk.rossmarks.fridalab/MainActivity를 확인하면 

```java
Override // android.view.View.OnClickListener
            public void onClick(View view) {
                if (challenge_01.getChall01Int() == 1) {
                    MainActivity.this.completeArr[0] = 1;
                }
                if (MainActivity.this.chall03()) {
                    MainActivity.this.completeArr[2] = 1;
                }
                MainActivity.this.chall05("notfrida!");
                if (MainActivity.this.chall08()) {
                    MainActivity.this.completeArr[7] = 1;
                }
                MainActivity.this.changeColors();
            }
```

해당 코드를 발견할 수 있고 getChall01Int() 메서드가 1이 되면 Solve된다.

Java에서는 전역변수, static 변수로 선언이 되는 경우 자동으로 0이 할당된다. 따라서 후킹을 통해 값을 1로 변경하여 풀이할 수 있다. 

```js
// chall01.js

Java.perform(() => {
	var challenge_01 = Java.use("uk.rossmarks.fridalab.challenge_01")
	challenge_01.chall01.value = 1
});
```

```cmd
C:\Windows\System32>frida -U -f uk.rossmarks.fridalab -l "C:\Users\강민정\Downloads\chall01.js"
     ____
    / _  |   Frida 17.11.0 - A world-class dynamic instrumentation toolkit
   | (_| |
    > _  |   Commands:
   /_/ |_|       help      -> Displays the help system
   . . . .       object?   -> Display information about 'object'
   . . . .       exit/quit -> Exit
   . . . .
   . . . .   More info at https://frida.re/docs/home/
   . . . .
   . . . .   Connected to Android Emulator 5554 (id=emulator-5554)
Spawned `uk.rossmarks.fridalab`. Resuming main thread!
[Android Emulator 5554::uk.rossmarks.fridalab ]->
```

정상적으로 후킹이 되면서 

<img width="527" height="371" alt="Image" src="https://github.com/user-attachments/assets/0ee1bb1e-e5d8-44aa-9b85-98896244df93" />

에뮬레이터의 FridaLab 01문제가 초록색으로 바뀐 것을 확인할 수 있다.

---

### challenge 02

같은 방법으로 Jadx를 통해 확인한 결과 따로 challenge_02 파일이 주어지지 않았다. 따라서 바로 MainActivity를 확인하였다.

```java
private void chall02() {
        this.completeArr[1] = 1;
    }
```

해당 코드는 chall02 메서드를 호출하면 해결된다. challenge 01과의 차이는 private 메서드라는 것이다. private 메서드는 앱 내부에서만 호출이 가능하고 외부에서는 직접 부를 수 없다. 따라서 실행 중인 인스턴스를 가져오는 Java.choose()를 통해 후킹을 진행한다.

```js
// chall02.js 

Java.perform(() => {
    setTimeout(function() {
        Java.choose("uk.rossmarks.fridalab.MainActivity", {
            "onMatch": function(instance) {
                instance.chall02();
            },
            "onComplete": function() {}
        });
    }, 1000);
});
```

`setTimeout(function() { … }, 1000)` → 1초 후에 코드 실행, 후킹 때 -f를 사용해서 Frida가 직접 실행하게 하는데 MainActivity가 생성되기 전에 스크립트가 실행되는 걸 방지하기 위한 딜레이, 처음에는 딜레이 없는 코드로 진행하였지만 통과되지 않았음

`Java.choose(”uk.rossmarks.fridalab.MainActivity”, { … })` → 현재 힙에서 실행 중인 MainActivity, 위에서 설명한 것과 같이 private이기 때문이다. static은 use

`“onMatch”: function(instance) { instance.chall02(); }` → 인스턴스를 발견하면 chall02()를 강제 호출

`“onComplete”: function() {}` → 탐색 완료 후 실행 

```cmd
C:\Windows\System32>frida -U -f uk.rossmarks.fridalab -l "C:\Users\강민정\Downloads\chall02.js"
     ____
    / _  |   Frida 17.11.0 - A world-class dynamic instrumentation toolkit
   | (_| |
    > _  |   Commands:
   /_/ |_|       help      -> Displays the help system
   . . . .       object?   -> Display information about 'object'
   . . . .       exit/quit -> Exit
   . . . .
   . . . .   More info at https://frida.re/docs/home/
   . . . .
   . . . .   Connected to Android Emulator 5554 (id=emulator-5554)
Spawned `uk.rossmarks.fridalab`. Resuming main thread!
[Android Emulator 5554::uk.rossmarks.fridalab ]->
```

정상적으로 실행이 되면서 

<img width="552" height="357" alt="Image" src="https://github.com/user-attachments/assets/e1ba13b5-5506-4ee5-8daf-8f66cfd7e922" />

Solve되었다.✌️
