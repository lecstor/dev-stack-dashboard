
### commits to master not in this branch
```
$ git cherry my-branch origin/master
+ 87babd2c67d97f3ac307f0e0824e6bedcab31935
+ 3ed2c0ceb9aa65741c26905c29e37819cd4251a5
+ 47bb9e9c1254396e1f20641aecef12e621084593
```

#### inc merge
```
$ git rev-list HEAD..origin/master
e8627811e29bc07774e2561d08ab80c2ca35b651
47bb9e9c1254396e1f20641aecef12e621084593
3ed2c0ceb9aa65741c26905c29e37819cd4251a5
87babd2c67d97f3ac307f0e0824e6bedcab31935
```

### last fetch
```
$ stat -c %Y .git/FETCH_HEAD
1596809276
$ stat -c %y .git/FETCH_HEAD
2020-08-08 00:07:56.494656610 +1000
```
> For anyone using this in a script: If a fetch or pull haven't been done yet then FETCH_HEAD won't exist yet and stat will return exit code 1.
