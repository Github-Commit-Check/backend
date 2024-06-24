# index.d.ts 파일을 dist 아래 경로로 옮기고 (중복 제거)
# 빌드된 파일들이 저장될 디렉토리에 package.json을 생성
cp dist/server.d.ts dist 

rm -rf dist/server.d.ts 

cat >dist/package.json <<!EOF
{
    "type": "commonjs"
}
!EOF
