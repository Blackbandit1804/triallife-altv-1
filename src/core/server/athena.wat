(module
  (type $t0 (func (param i32 i32)))
  (type $t1 (func (param i32 i32) (result i32)))
  (type $t2 (func (param i32 i32 i32)))
  (type $t3 (func (param i32) (result i32)))
  (type $t4 (func))
  (type $t5 (func (param i32)))
  (type $t6 (func (result i32)))
  (type $t7 (func (param i32 i32 i32 i32)))
  (type $t8 (func (param i32 i32 i32) (result i32)))
  (import "env" "abort" (func $env.abort (type $t7)))
  (import "index" "ex.emit" (func $index.ex.emit (type $t0)))
  (func $f2 (type $t0) (param $p0 i32) (param $p1 i32)
    (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 i32)
    local.get $p1
    i32.load
    local.tee $l2
    i32.const 1
    i32.and
    i32.eqz
    if $I0
      i32.const 0
      i32.const 1184
      i32.const 272
      i32.const 14
      call $env.abort
      unreachable
    end
    local.get $l2
    i32.const -4
    i32.and
    local.tee $l2
    i32.const 1073741820
    i32.lt_u
    i32.const 0
    local.get $l2
    i32.const 12
    i32.ge_u
    select
    i32.eqz
    if $I1
      i32.const 0
      i32.const 1184
      i32.const 274
      i32.const 14
      call $env.abort
      unreachable
    end
    local.get $l2
    i32.const 256
    i32.lt_u
    if $I2
      local.get $l2
      i32.const 4
      i32.shr_u
      local.set $l2
    else
      local.get $l2
      i32.const 31
      local.get $l2
      i32.clz
      i32.sub
      local.tee $l3
      i32.const 4
      i32.sub
      i32.shr_u
      i32.const 16
      i32.xor
      local.set $l2
      local.get $l3
      i32.const 7
      i32.sub
      local.set $l3
    end
    local.get $l2
    i32.const 16
    i32.lt_u
    i32.const 0
    local.get $l3
    i32.const 23
    i32.lt_u
    select
    i32.eqz
    if $I3
      i32.const 0
      i32.const 1184
      i32.const 287
      i32.const 14
      call $env.abort
      unreachable
    end
    local.get $p1
    i32.load offset=8
    local.set $l4
    local.get $p1
    i32.load offset=4
    local.tee $l5
    if $I4
      local.get $l5
      local.get $l4
      i32.store offset=8
    end
    local.get $l4
    if $I5
      local.get $l4
      local.get $l5
      i32.store offset=4
    end
    local.get $p1
    local.get $p0
    local.get $l2
    local.get $l3
    i32.const 4
    i32.shl
    i32.add
    i32.const 2
    i32.shl
    i32.add
    i32.load offset=96
    i32.eq
    if $I6
      local.get $p0
      local.get $l2
      local.get $l3
      i32.const 4
      i32.shl
      i32.add
      i32.const 2
      i32.shl
      i32.add
      local.get $l4
      i32.store offset=96
      local.get $l4
      i32.eqz
      if $I7
        local.get $p0
        local.get $l3
        i32.const 2
        i32.shl
        i32.add
        local.tee $l4
        i32.load offset=4
        i32.const -2
        local.get $l2
        i32.rotl
        i32.and
        local.set $p1
        local.get $l4
        local.get $p1
        i32.store offset=4
        local.get $p1
        i32.eqz
        if $I8
          local.get $p0
          local.get $p0
          i32.load
          i32.const -2
          local.get $l3
          i32.rotl
          i32.and
          i32.store
        end
      end
    end)
  (func $f3 (type $t0) (param $p0 i32) (param $p1 i32)
    (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32)
    local.get $p1
    i32.eqz
    if $I0
      i32.const 0
      i32.const 1184
      i32.const 200
      i32.const 14
      call $env.abort
      unreachable
    end
    local.get $p1
    i32.load
    local.tee $l4
    i32.const 1
    i32.and
    i32.eqz
    if $I1
      i32.const 0
      i32.const 1184
      i32.const 202
      i32.const 14
      call $env.abort
      unreachable
    end
    local.get $p1
    i32.const 4
    i32.add
    local.get $p1
    i32.load
    i32.const -4
    i32.and
    i32.add
    local.tee $l5
    i32.load
    local.tee $l2
    i32.const 1
    i32.and
    if $I2
      local.get $l4
      i32.const -4
      i32.and
      i32.const 4
      i32.add
      local.get $l2
      i32.const -4
      i32.and
      i32.add
      local.tee $l3
      i32.const 1073741820
      i32.lt_u
      if $I3
        block $B4 (result i32)
          local.get $p0
          local.get $l5
          call $f2
          local.get $p1
          local.get $l3
          local.get $l4
          i32.const 3
          i32.and
          i32.or
          local.tee $l4
          i32.store
          local.get $p1
          i32.const 4
          i32.add
          local.get $p1
          i32.load
          i32.const -4
          i32.and
          i32.add
          local.tee $l5
          i32.load
        end
        local.set $l2
      end
    end
    local.get $l4
    i32.const 2
    i32.and
    if $I5
      block $B6 (result i32)
        local.get $p1
        i32.const 4
        i32.sub
        i32.load
        local.tee $l3
        i32.load
        local.tee $l7
        i32.const 1
        i32.and
        i32.eqz
        if $I7
          i32.const 0
          i32.const 1184
          i32.const 223
          i32.const 16
          call $env.abort
          unreachable
        end
        local.get $l7
        i32.const -4
        i32.and
        i32.const 4
        i32.add
        local.get $l4
        i32.const -4
        i32.and
        i32.add
        local.tee $l8
        i32.const 1073741820
        i32.lt_u
        if $I8 (result i32)
          local.get $p0
          local.get $l3
          call $f2
          local.get $l3
          local.get $l8
          local.get $l7
          i32.const 3
          i32.and
          i32.or
          local.tee $l4
          i32.store
          local.get $l3
        else
          local.get $p1
        end
      end
      local.set $p1
    end
    local.get $l5
    local.get $l2
    i32.const 2
    i32.or
    i32.store
    local.get $l4
    i32.const -4
    i32.and
    local.tee $l3
    i32.const 1073741820
    i32.lt_u
    i32.const 0
    local.get $l3
    i32.const 12
    i32.ge_u
    select
    i32.eqz
    if $I9
      i32.const 0
      i32.const 1184
      i32.const 238
      i32.const 14
      call $env.abort
      unreachable
    end
    local.get $l3
    local.get $p1
    i32.const 4
    i32.add
    i32.add
    local.get $l5
    i32.ne
    if $I10
      i32.const 0
      i32.const 1184
      i32.const 239
      i32.const 14
      call $env.abort
      unreachable
    end
    local.get $l5
    i32.const 4
    i32.sub
    local.get $p1
    i32.store
    local.get $l3
    i32.const 256
    i32.lt_u
    if $I11
      local.get $l3
      i32.const 4
      i32.shr_u
      local.set $l3
    else
      local.get $l3
      i32.const 31
      local.get $l3
      i32.clz
      i32.sub
      local.tee $l4
      i32.const 4
      i32.sub
      i32.shr_u
      i32.const 16
      i32.xor
      local.set $l3
      local.get $l4
      i32.const 7
      i32.sub
      local.set $l6
    end
    local.get $l3
    i32.const 16
    i32.lt_u
    i32.const 0
    local.get $l6
    i32.const 23
    i32.lt_u
    select
    i32.eqz
    if $I12
      i32.const 0
      i32.const 1184
      i32.const 255
      i32.const 14
      call $env.abort
      unreachable
    end
    local.get $p0
    local.get $l3
    local.get $l6
    i32.const 4
    i32.shl
    i32.add
    i32.const 2
    i32.shl
    i32.add
    i32.load offset=96
    local.set $l4
    local.get $p1
    i32.const 0
    i32.store offset=4
    local.get $p1
    local.get $l4
    i32.store offset=8
    local.get $l4
    if $I13
      local.get $l4
      local.get $p1
      i32.store offset=4
    end
    local.get $p0
    local.get $l3
    local.get $l6
    i32.const 4
    i32.shl
    i32.add
    i32.const 2
    i32.shl
    i32.add
    local.get $p1
    i32.store offset=96
    local.get $p0
    local.get $p0
    i32.load
    i32.const 1
    local.get $l6
    i32.shl
    i32.or
    i32.store
    local.get $p0
    local.get $l6
    i32.const 2
    i32.shl
    i32.add
    local.tee $p0
    local.get $p0
    i32.load offset=4
    i32.const 1
    local.get $l3
    i32.shl
    i32.or
    i32.store offset=4)
  (func $f4 (type $t2) (param $p0 i32) (param $p1 i32) (param $p2 i32)
    (local $l3 i32) (local $l4 i32)
    local.get $p1
    local.get $p2
    i32.gt_u
    if $I0
      i32.const 0
      i32.const 1184
      i32.const 380
      i32.const 14
      call $env.abort
      unreachable
    end
    local.get $p1
    i32.const 19
    i32.add
    i32.const -16
    i32.and
    i32.const 4
    i32.sub
    local.set $p1
    local.get $p2
    i32.const -16
    i32.and
    local.set $l3
    local.get $p0
    i32.load offset=1568
    local.tee $p2
    if $I1
      local.get $p1
      local.get $p2
      i32.const 4
      i32.add
      i32.lt_u
      if $I2
        i32.const 0
        i32.const 1184
        i32.const 387
        i32.const 16
        call $env.abort
        unreachable
      end
      local.get $p2
      local.get $p1
      i32.const 16
      i32.sub
      i32.eq
      if $I3
        block $B4 (result i32)
          local.get $p2
          i32.load
          local.set $l4
          local.get $p1
          i32.const 16
          i32.sub
        end
        local.set $p1
      end
    else
      local.get $p1
      local.get $p0
      i32.const 1572
      i32.add
      i32.lt_u
      if $I5
        i32.const 0
        i32.const 1184
        i32.const 400
        i32.const 5
        call $env.abort
        unreachable
      end
    end
    local.get $l3
    local.get $p1
    i32.sub
    local.tee $p2
    i32.const 20
    i32.lt_u
    if $I6
      return
    end
    local.get $p1
    local.get $l4
    i32.const 2
    i32.and
    local.get $p2
    i32.const 8
    i32.sub
    local.tee $p2
    i32.const 1
    i32.or
    i32.or
    i32.store
    local.get $p1
    i32.const 0
    i32.store offset=4
    local.get $p1
    i32.const 0
    i32.store offset=8
    local.get $p2
    local.get $p1
    i32.const 4
    i32.add
    i32.add
    local.tee $p2
    i32.const 2
    i32.store
    local.get $p0
    local.get $p2
    i32.store offset=1568
    local.get $p0
    local.get $p1
    call $f3)
  (func $f5 (type $t4)
    (local $l0 i32) (local $l1 i32)
    memory.size
    local.tee $l0
    i32.const 1
    i32.lt_s
    if $I0 (result i32)
      i32.const 1
      local.get $l0
      i32.sub
      memory.grow
      i32.const 0
      i32.lt_s
    else
      i32.const 0
    end
    if $I1
      unreachable
    end
    i32.const 1408
    i32.const 0
    i32.store
    i32.const 2976
    i32.const 0
    i32.store
    loop $L2
      local.get $l1
      i32.const 23
      i32.lt_u
      if $I3
        local.get $l1
        i32.const 2
        i32.shl
        i32.const 1408
        i32.add
        i32.const 0
        i32.store offset=4
        i32.const 0
        local.set $l0
        loop $L4
          local.get $l0
          i32.const 16
          i32.lt_u
          if $I5
            local.get $l0
            local.get $l1
            i32.const 4
            i32.shl
            i32.add
            i32.const 2
            i32.shl
            i32.const 1408
            i32.add
            i32.const 0
            i32.store offset=96
            local.get $l0
            i32.const 1
            i32.add
            local.set $l0
            br $L4
          end
        end
        local.get $l1
        i32.const 1
        i32.add
        local.set $l1
        br $L2
      end
    end
    i32.const 1408
    i32.const 2980
    memory.size
    i32.const 16
    i32.shl
    call $f4
    i32.const 1408
    global.set $g0)
  (func $f6 (type $t3) (param $p0 i32) (result i32)
    local.get $p0
    i32.const 1073741820
    i32.ge_u
    if $I0
      i32.const 1056
      i32.const 1184
      i32.const 461
      i32.const 30
      call $env.abort
      unreachable
    end
    i32.const 12
    local.get $p0
    i32.const 19
    i32.add
    i32.const -16
    i32.and
    i32.const 4
    i32.sub
    local.get $p0
    i32.const 12
    i32.le_u
    select)
  (func $f7 (type $t1) (param $p0 i32) (param $p1 i32) (result i32)
    (local $l2 i32)
    local.get $p1
    i32.const 256
    i32.lt_u
    if $I0
      local.get $p1
      i32.const 4
      i32.shr_u
      local.set $p1
    else
      i32.const 31
      local.get $p1
      i32.const 1
      i32.const 27
      local.get $p1
      i32.clz
      i32.sub
      i32.shl
      i32.add
      i32.const 1
      i32.sub
      local.get $p1
      local.get $p1
      i32.const 536870910
      i32.lt_u
      select
      local.tee $p1
      i32.clz
      i32.sub
      local.set $l2
      local.get $p1
      local.get $l2
      i32.const 4
      i32.sub
      i32.shr_u
      i32.const 16
      i32.xor
      local.set $p1
      local.get $l2
      i32.const 7
      i32.sub
      local.set $l2
    end
    local.get $p1
    i32.const 16
    i32.lt_u
    i32.const 0
    local.get $l2
    i32.const 23
    i32.lt_u
    select
    i32.eqz
    if $I1
      i32.const 0
      i32.const 1184
      i32.const 333
      i32.const 14
      call $env.abort
      unreachable
    end
    local.get $p0
    local.get $l2
    i32.const 2
    i32.shl
    i32.add
    i32.load offset=4
    i32.const -1
    local.get $p1
    i32.shl
    i32.and
    local.tee $p1
    if $I2 (result i32)
      local.get $p0
      local.get $p1
      i32.ctz
      local.get $l2
      i32.const 4
      i32.shl
      i32.add
      i32.const 2
      i32.shl
      i32.add
      i32.load offset=96
    else
      local.get $p0
      i32.load
      i32.const -1
      local.get $l2
      i32.const 1
      i32.add
      i32.shl
      i32.and
      local.tee $p1
      if $I3 (result i32)
        local.get $p0
        local.get $p1
        i32.ctz
        local.tee $p1
        i32.const 2
        i32.shl
        i32.add
        i32.load offset=4
        local.tee $l2
        i32.eqz
        if $I4
          i32.const 0
          i32.const 1184
          i32.const 346
          i32.const 18
          call $env.abort
          unreachable
        end
        local.get $p0
        local.get $l2
        i32.ctz
        local.get $p1
        i32.const 4
        i32.shl
        i32.add
        i32.const 2
        i32.shl
        i32.add
        i32.load offset=96
      else
        i32.const 0
      end
    end)
  (func $f8 (type $t2) (param $p0 i32) (param $p1 i32) (param $p2 i32)
    (local $l3 i32) (local $l4 i32)
    local.get $p1
    i32.load
    local.set $l3
    local.get $p2
    i32.const 4
    i32.add
    i32.const 15
    i32.and
    if $I0
      i32.const 0
      i32.const 1184
      i32.const 360
      i32.const 14
      call $env.abort
      unreachable
    end
    local.get $l3
    i32.const -4
    i32.and
    local.get $p2
    i32.sub
    local.tee $l4
    i32.const 16
    i32.ge_u
    if $I1
      local.get $p1
      local.get $p2
      local.get $l3
      i32.const 2
      i32.and
      i32.or
      i32.store
      local.get $p2
      local.get $p1
      i32.const 4
      i32.add
      i32.add
      local.tee $p1
      local.get $l4
      i32.const 4
      i32.sub
      i32.const 1
      i32.or
      i32.store
      local.get $p0
      local.get $p1
      call $f3
    else
      local.get $p1
      local.get $l3
      i32.const -2
      i32.and
      i32.store
      local.get $p1
      i32.const 4
      i32.add
      local.tee $p0
      local.get $p1
      i32.load
      i32.const -4
      i32.and
      i32.add
      local.get $p0
      local.get $p1
      i32.load
      i32.const -4
      i32.and
      i32.add
      i32.load
      i32.const -3
      i32.and
      i32.store
    end)
  (func $f9 (type $t1) (param $p0 i32) (param $p1 i32) (result i32)
    (local $l2 i32) (local $l3 i32)
    local.get $p0
    local.get $p1
    call $f6
    local.tee $l2
    call $f7
    local.tee $p1
    i32.eqz
    if $I0
      i32.const 4
      memory.size
      local.tee $p1
      i32.const 16
      i32.shl
      i32.const 4
      i32.sub
      local.get $p0
      i32.load offset=1568
      i32.ne
      i32.shl
      local.get $l2
      i32.const 1
      i32.const 27
      local.get $l2
      i32.clz
      i32.sub
      i32.shl
      i32.const 1
      i32.sub
      i32.add
      local.get $l2
      local.get $l2
      i32.const 536870910
      i32.lt_u
      select
      i32.add
      i32.const 65535
      i32.add
      i32.const -65536
      i32.and
      i32.const 16
      i32.shr_u
      local.set $l3
      local.get $p1
      local.get $l3
      local.get $p1
      local.get $l3
      i32.gt_s
      select
      memory.grow
      i32.const 0
      i32.lt_s
      if $I1
        local.get $l3
        memory.grow
        i32.const 0
        i32.lt_s
        if $I2
          unreachable
        end
      end
      local.get $p0
      local.get $p1
      i32.const 16
      i32.shl
      memory.size
      i32.const 16
      i32.shl
      call $f4
      local.get $p0
      local.get $l2
      call $f7
      local.tee $p1
      i32.eqz
      if $I3
        i32.const 0
        i32.const 1184
        i32.const 498
        i32.const 16
        call $env.abort
        unreachable
      end
    end
    local.get $l2
    local.get $p1
    i32.load
    i32.const -4
    i32.and
    i32.gt_u
    if $I4
      i32.const 0
      i32.const 1184
      i32.const 500
      i32.const 14
      call $env.abort
      unreachable
    end
    local.get $p0
    local.get $p1
    call $f2
    local.get $p0
    local.get $p1
    local.get $l2
    call $f8
    local.get $p1)
  (func $__new (type $t1) (param $p0 i32) (param $p1 i32) (result i32)
    (local $l2 i32) (local $l3 i32)
    local.get $p0
    i32.const 1073741804
    i32.gt_u
    if $I0
      i32.const 1056
      i32.const 1120
      i32.const 275
      i32.const 30
      call $env.abort
      unreachable
    end
    local.get $p0
    i32.const 16
    i32.add
    local.set $l2
    global.get $g0
    i32.eqz
    if $I1
      call $f5
    end
    global.get $g0
    local.get $l2
    call $f9
    i32.const 4
    i32.add
    local.tee $l3
    i32.const 4
    i32.sub
    local.tee $l2
    i32.const 0
    i32.store offset=4
    local.get $l2
    i32.const 0
    i32.store offset=8
    local.get $l2
    local.get $p1
    i32.store offset=12
    local.get $l2
    local.get $p0
    i32.store offset=16
    local.get $l3
    i32.const 16
    i32.add)
  (func $f11 (type $t3) (param $p0 i32) (result i32)
    (local $l1 i32)
    local.get $p0
    i32.const 4
    i32.sub
    local.set $l1
    local.get $p0
    i32.const 15
    i32.and
    i32.eqz
    i32.const 0
    local.get $p0
    select
    if $I0 (result i32)
      local.get $l1
      i32.load
      i32.const 1
      i32.and
      i32.eqz
    else
      i32.const 0
    end
    i32.eqz
    if $I1
      i32.const 0
      i32.const 1184
      i32.const 563
      i32.const 3
      call $env.abort
      unreachable
    end
    local.get $l1)
  (func $f12 (type $t2) (param $p0 i32) (param $p1 i32) (param $p2 i32)
    (local $l3 i32) (local $l4 i32)
    block $B0
      local.get $p2
      local.set $l4
      local.get $p0
      local.get $p1
      i32.eq
      br_if $B0
      local.get $p0
      local.get $p1
      i32.lt_u
      if $I1
        local.get $p1
        i32.const 7
        i32.and
        local.get $p0
        i32.const 7
        i32.and
        i32.eq
        if $I2
          loop $L3
            local.get $p0
            i32.const 7
            i32.and
            if $I4
              local.get $l4
              i32.eqz
              br_if $B0
              local.get $l4
              i32.const 1
              i32.sub
              local.set $l4
              local.get $p0
              local.tee $p2
              i32.const 1
              i32.add
              local.set $p0
              local.get $p1
              local.tee $l3
              i32.const 1
              i32.add
              local.set $p1
              local.get $p2
              local.get $l3
              i32.load8_u
              i32.store8
              br $L3
            end
          end
          loop $L5
            local.get $l4
            i32.const 8
            i32.ge_u
            if $I6
              local.get $p0
              local.get $p1
              i64.load
              i64.store
              local.get $l4
              i32.const 8
              i32.sub
              local.set $l4
              local.get $p0
              i32.const 8
              i32.add
              local.set $p0
              local.get $p1
              i32.const 8
              i32.add
              local.set $p1
              br $L5
            end
          end
        end
        loop $L7
          local.get $l4
          if $I8
            local.get $p0
            local.tee $p2
            i32.const 1
            i32.add
            local.set $p0
            local.get $p1
            local.tee $l3
            i32.const 1
            i32.add
            local.set $p1
            local.get $p2
            local.get $l3
            i32.load8_u
            i32.store8
            local.get $l4
            i32.const 1
            i32.sub
            local.set $l4
            br $L7
          end
        end
      else
        local.get $p1
        i32.const 7
        i32.and
        local.get $p0
        i32.const 7
        i32.and
        i32.eq
        if $I9
          loop $L10
            local.get $p0
            local.get $l4
            i32.add
            i32.const 7
            i32.and
            if $I11
              local.get $l4
              i32.eqz
              br_if $B0
              local.get $l4
              i32.const 1
              i32.sub
              local.tee $l4
              local.get $p0
              i32.add
              local.get $p1
              local.get $l4
              i32.add
              i32.load8_u
              i32.store8
              br $L10
            end
          end
          loop $L12
            local.get $l4
            i32.const 8
            i32.ge_u
            if $I13
              local.get $l4
              i32.const 8
              i32.sub
              local.tee $l4
              local.get $p0
              i32.add
              local.get $p1
              local.get $l4
              i32.add
              i64.load
              i64.store
              br $L12
            end
          end
        end
        loop $L14
          local.get $l4
          if $I15
            local.get $l4
            i32.const 1
            i32.sub
            local.tee $l4
            local.get $p0
            i32.add
            local.get $p1
            local.get $l4
            i32.add
            i32.load8_u
            i32.store8
            br $L14
          end
        end
      end
    end)
  (func $f13 (type $t0) (param $p0 i32) (param $p1 i32)
    local.get $p1
    local.get $p1
    i32.load
    i32.const 1
    i32.or
    i32.store
    local.get $p0
    local.get $p1
    call $f3)
  (func $f14 (type $t8) (param $p0 i32) (param $p1 i32) (param $p2 i32) (result i32)
    local.get $p0
    local.get $p2
    call $f9
    local.tee $p2
    i32.const 4
    i32.add
    local.get $p1
    i32.const 4
    i32.add
    local.get $p1
    i32.load
    i32.const -4
    i32.and
    call $f12
    local.get $p1
    i32.const 1404
    i32.ge_u
    if $I0
      local.get $p0
      local.get $p1
      call $f13
    end
    local.get $p2)
  (func $__renew (type $t1) (param $p0 i32) (param $p1 i32) (result i32)
    (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32)
    local.get $p1
    i32.const 1073741804
    i32.gt_u
    if $I0
      i32.const 1056
      i32.const 1120
      i32.const 288
      i32.const 30
      call $env.abort
      unreachable
    end
    local.get $p0
    i32.const 16
    i32.sub
    local.set $p0
    global.get $g0
    i32.eqz
    if $I1
      call $f5
    end
    local.get $p1
    i32.const 16
    i32.add
    local.set $l2
    local.get $p0
    i32.const 1404
    i32.lt_u
    if $I2
      global.get $g0
      local.get $p0
      call $f11
      local.get $l2
      call $f14
      local.set $p0
    else
      block $B3
        global.get $g0
        local.set $l3
        local.get $p0
        call $f11
        local.set $p0
        block $B4
          local.get $l2
          call $f6
          local.tee $l5
          local.get $p0
          i32.load
          local.tee $l6
          i32.const -4
          i32.and
          local.tee $l4
          i32.le_u
          br_if $B4
          local.get $p0
          i32.const 4
          i32.add
          local.get $p0
          i32.load
          i32.const -4
          i32.and
          i32.add
          local.tee $l7
          i32.load
          local.tee $l8
          i32.const 1
          i32.and
          if $I5
            local.get $l5
            local.get $l4
            i32.const 4
            i32.add
            local.get $l8
            i32.const -4
            i32.and
            i32.add
            local.tee $l4
            i32.le_u
            if $I6
              local.get $l3
              local.get $l7
              call $f2
              local.get $p0
              local.get $l4
              local.get $l6
              i32.const 3
              i32.and
              i32.or
              i32.store
              br $B4
            end
          end
          local.get $l3
          local.get $p0
          local.get $l2
          call $f14
          local.set $p0
          br $B3
        end
        local.get $l3
        local.get $p0
        local.get $l5
        call $f8
      end
    end
    local.get $p0
    i32.const 4
    i32.add
    local.tee $p0
    i32.const 4
    i32.sub
    local.get $p1
    i32.store offset=16
    local.get $p0
    i32.const 16
    i32.add)
  (func $__retain (type $t3) (param $p0 i32) (result i32)
    (local $l1 i32) (local $l2 i32)
    local.get $p0
    i32.const 1404
    i32.gt_u
    if $I0
      local.get $p0
      i32.const 20
      i32.sub
      local.tee $l1
      i32.load offset=4
      local.tee $l2
      i32.const -268435456
      i32.and
      local.get $l2
      i32.const 1
      i32.add
      i32.const -268435456
      i32.and
      i32.ne
      if $I1
        i32.const 0
        i32.const 1120
        i32.const 109
        i32.const 3
        call $env.abort
        unreachable
      end
      local.get $l1
      local.get $l2
      i32.const 1
      i32.add
      i32.store offset=4
      local.get $l1
      i32.load
      i32.const 1
      i32.and
      if $I2
        i32.const 0
        i32.const 1120
        i32.const 112
        i32.const 14
        call $env.abort
        unreachable
      end
    end
    local.get $p0)
  (func $__release (type $t5) (param $p0 i32)
    local.get $p0
    i32.const 1404
    i32.gt_u
    if $I0
      local.get $p0
      i32.const 20
      i32.sub
      call $f21
    end)
  (func $getEvent (type $t6) (result i32)
    i32.const 1312)
  (func $getName (type $t6) (result i32)
    i32.const 1360)
  (func $deploy (type $t4)
    i32.const 1312
    i32.const 1248
    call $index.ex.emit)
  (func $f21 (type $t5) (param $p0 i32)
    (local $l1 i32) (local $l2 i32)
    local.get $p0
    i32.load offset=4
    local.tee $l2
    i32.const 268435455
    i32.and
    local.set $l1
    local.get $p0
    i32.load
    i32.const 1
    i32.and
    if $I0
      i32.const 0
      i32.const 1120
      i32.const 122
      i32.const 14
      call $env.abort
      unreachable
    end
    local.get $l1
    i32.const 1
    i32.eq
    if $I1
      block $B2
        block $B3
          block $B4
            local.get $p0
            i32.const 12
            i32.add
            i32.load
            br_table $B2 $B2 $B4 $B3
          end
          local.get $p0
          i32.load offset=20
          local.tee $l1
          if $I5
            local.get $l1
            i32.const 1404
            i32.ge_u
            if $I6
              local.get $l1
              i32.const 20
              i32.sub
              call $f21
            end
          end
          br $B2
        end
        unreachable
      end
      local.get $l2
      i32.const -2147483648
      i32.and
      if $I7
        i32.const 0
        i32.const 1120
        i32.const 126
        i32.const 18
        call $env.abort
        unreachable
      end
      global.get $g0
      local.get $p0
      call $f13
    else
      local.get $l1
      i32.eqz
      if $I8
        i32.const 0
        i32.const 1120
        i32.const 136
        i32.const 16
        call $env.abort
        unreachable
      end
      local.get $p0
      local.get $l1
      i32.const 1
      i32.sub
      local.get $l2
      i32.const -268435456
      i32.and
      i32.or
      i32.store offset=4
    end)
  (memory $memory 1)
  (global $g0 (mut i32) (i32.const 0))
  (global $__rtti_base i32 (i32.const 1376))
  (export "memory" (memory 0))
  (export "__new" (func $__new))
  (export "__renew" (func $__renew))
  (export "__retain" (func $__retain))
  (export "__release" (func $__release))
  (export "__rtti_base" (global 1))
  (export "getEvent" (func $getEvent))
  (export "getName" (func $getName))
  (export "deploy" (func $deploy))
  (data $d0 (i32.const 1036) "<\00\00\00\01\00\00\00\00\00\00\00\01\00\00\00(\00\00\00a\00l\00l\00o\00c\00a\00t\00i\00o\00n\00 \00t\00o\00o\00 \00l\00a\00r\00g\00e")
  (data $d1 (i32.const 1100) "<\00\00\00\01\00\00\00\00\00\00\00\01\00\00\00\1e\00\00\00~\00l\00i\00b\00/\00r\00t\00/\00p\00u\00r\00e\00.\00t\00s")
  (data $d2 (i32.const 1164) "<\00\00\00\01\00\00\00\00\00\00\00\01\00\00\00\1e\00\00\00~\00l\00i\00b\00/\00r\00t\00/\00t\00l\00s\00f\00.\00t\00s")
  (data $d3 (i32.const 1228) "<\00\00\00\01\00\00\00\00\00\00\00\01\00\00\00\1e\00\00\00/\00v\001\00/\00p\00o\00s\00t\00/\00i\00m\00p\00o\00r\00t")
  (data $d4 (i32.const 1292) ",\00\00\00\01\00\00\00\00\00\00\00\01\00\00\00\16\00\00\00a\00t\00h\00e\00n\00a\00:\00B\00o\00o\00t")
  (data $d5 (i32.const 1340) "\1c\00\00\00\01\00\00\00\00\00\00\00\01\00\00\00\0c\00\00\00a\00t\00h\00e\00n\00a")
  (data $d6 (i32.const 1376) "\03\00\00\00 \00\00\00\00\00\00\00 \00\00\00\00\00\00\00 "))
