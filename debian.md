# debian

#### bind port <1024
```shell
 sudo apt-get install libcap2-bin
 sudo setcap cap_net_bind_service=+ep `readlink -f \`which node\``
```

#### build or install error
```shell
 sudo apt-get install build-essential
```
