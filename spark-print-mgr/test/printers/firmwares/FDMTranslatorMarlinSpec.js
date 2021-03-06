var should = require('should'),
    fs = require('fs'),
    os = require('os'),
    path = require('path'),
    ProtoBuf = require('protobufjs'),
    Promise = require('Promise'),
    util = require('util'),

    FDMReader = require('../../../printableTranslation/FDMReader'),
    FDMTranslatorMarlin = require('../../../printableTranslation/FDMTranslatorMarlin'),
    TestHelper = require('../../helpers/TestHelper'),
    config = require('../../../config.json'),
    dateUtils = require('../../../utils/dateUtils'),

    inputFile = path.join(__dirname, '../../data/printables/FDMPrintable.mic'),
    outputFile = path.join(os.tmpdir(), 'FDMPrintable.mic');


describe('FDM Translator Marlin with terse config', function () {
    var config = {
        verbose : undefined,
        precision : undefined
    };

    config.verbose = false;
    config.precision = {
        x: 3,
        y: 3,
        z: 3,
        e: 5,
        f: 0,
        p: 0,
        s: 0
    };

    var translator = new FDMTranslatorMarlin(undefined, undefined, undefined, config);

    it('should convert a command of type MOVE into a "move" command', function (done) {
        translator.convertCommand(command_move).should.equal("G1 X132.619 Y171.071 Z0.300 F12000\n");
        done();
    });

    it('should convert a command of type EXTRUDE_MOVE into an "extrude move" command', function (done) {
        translator.convertCommand(command_extrude_move).should.equal("G1 X140.788 Y145.388 E190.98804 F2400\nG1 X139.181 Y144.346 E191.05176\nG1 X138.722 Y143.887 E191.07333\n");
        done();
    });

    it('should convert a command of type EXTRUDE into an "extrude" command', function (done) {
        translator.convertCommand(command_extrude).should.equal("G1 E40.54023\n");
        done();
    });

    it('should convert a command of type SET_FEED_RATE into a "set feed rate" command', function (done) {
        translator.convertCommand(command_set_feed_rate).should.equal("G1 F12000\n");
        done();
    });

    it('should convert a command of type SET_TEMP_BED into a "set temp bed" command', function (done) {
        translator.convertCommand(command_set_temp_bed).should.equal("M190 S60\n");
        done();
    });

    it('should convert a command of type SET_TEMP_NOZZLE into a "set temp nozzle" command', function (done) {
        translator.convertCommand(command_set_temp_nozzle).should.equal("M109 S220\n");
        done();
    });

    it('should convert a command of type SET_FAN_SPEED into a "set fan speed" command', function (done) {
        translator.convertCommand(command_set_fan_speed).should.equal("M106 S255\n");
        done();
    });

    it('should convert a command of type SET_UNITS into a "set units command', function (done) {
        translator.convertCommand(command_set_units).should.equal("G21\n");
        done();
    });

    it('should convert a command of type DISABLE_MOTORS into a "disable motors command', function (done) {
        translator.convertCommand(command_disable_motors).should.equal("M84\n");
        done();
    });

    it('should convert a command of type SET_MODE_XYZ into a "set mode xyz command', function (done) {
        translator.convertCommand(command_set_mode_xyz).should.equal("G90\n");
        done();
    });

    it('should convert a command of type SET_MODE_E into a "set mode e command', function (done) {
        translator.convertCommand(command_set_mode_e).should.equal("M82\n");
        done();
    });

    it('should convert a command of type RESET_EXTRUSION_DISTANCE into a "reset extrusion distance command', function (done) {
        translator.convertCommand(command_reset_extrusion_distance).should.equal("G92 E0\n");
        done();
    });

    it('should convert a command of type PAUSE into a "pause command', function (done) {
        translator.convertCommand(command_pause).should.equal("G4 S100\n");
        done();
    });

    it('should convert a command of type HOME_AXES into a "home axes command', function (done) {
        translator.convertCommand(command_home_axes).should.equal("G28\n");
        done();
    });

    it('should convert a command of type HOME_AXES-only xy into a "home axes command', function (done) {
        translator.convertCommand(command_home_axes_xy).should.equal("G28 X0.000 Y0.000\n");
        done();
    });

    it('should convert a command of type HOME_AXES-only z into a "home axes command', function (done) {
        translator.convertCommand(command_home_axes_z).should.equal("G28 Z0.000\n");
        done();
    });

    it('should convert a command of type COMMENT into an empty string', function (done) {
        translator.convertCommand(command_comment).should.equal("");
        done();
    });

    it('should convert a command of type STARTPRINT into an empty string', function (done) {
        translator.convertCommand(command_startprint).should.equal("");
        done();
    });

    it('should convert a command of type ENDPRINT into an empty string', function (done) {
        translator.convertCommand(command_endprint).should.equal("");
        done();
    });

    it('should convert a command of type CUSTOM into a "custom command', function (done) {
        translator.convertCommand(command_custom).should.equal("G867 5309\n");
        done();
    });

    it('should convert a command of type PROGRESS into an empty string', function (done) {
        translator.convertCommand(command_progress).should.equal("");
        done();
    });

    it('should convert a command of type END_OF_COMMANDS into an empty string', function (done) {
        translator.convertCommand(command_end_of_commands).should.equal("");
        done();
    });

    it('should convert a command of type ESTIMATES into an empty string', function (done) {
        translator.convertCommand(command_estimates).should.equal("");
        done();
    });

    it('should translate a valid FDM file', function (done) {
        this.timeout(10000);
        translator.translate(inputFile, outputFile)
        .then(function () {
            done();
        })
        .catch(function (err) {
            done(err);
        });
    });
});


var command_end_of_commands = {
    type: 0,
    x: [],
    y: [],
    z: [],
    e: [],
    f: [],
    nozzle_temp: 0,
    bed_temp: 0,
    fan_speed: 0,
    pause_time: 0,
    comment: '',
    units: 0,
    mode: 0,
    wait: false,
    custom: '',
    progress: 0,
    estimated_print_time: 0,
    estimated_material_length: 0
};

var command_move = {
    type: 1,
    x: [ 132.61878967285156 ],
    y: [ 171.0710906982422 ],
    z: [ 0.29999998211860657 ],
    e: [],
    f: [ 12000 ],
    nozzle_temp: 0,
    bed_temp: 0,
    fan_speed: 0,
    pause_time: 0,
    comment: '',
    units: 0,
    mode: 0,
    wait: false,
    custom: '',
    progress: 0,
    estimated_print_time: 0,
    estimated_material_length: 0
};

var command_extrude_move = {
    type: 2,
    x: [ 140.78848266601562, 139.18099975585938, 138.72183227539062 ],
    y: [ 145.38790893554688, 144.3461151123047, 143.886962890625 ],
    z: [],
    e: [ 190.988037109375, 191.0517578125, 191.07333374023438 ],
    f: [ 2400 ],
    nozzle_temp: 0,
    bed_temp: 0,
    fan_speed: 0,
    pause_time: 0,
    comment: 'bead-solid_infill',
    units: 0,
    mode: 0,
    wait: false,
    custom: '',
    progress: 0,
    estimated_print_time: 0,
    estimated_material_length: 0
};


var command_extrude = {
    type: 3,
    x: [],
    y: [],
    z: [],
    e: [ 40.54022979736328 ],
    f: [],
    nozzle_temp: 0,
    bed_temp: 0,
    fan_speed: 0,
    pause_time: 0,
    comment: '',
    units: 0,
    mode: 0,
    wait: false,
    custom: '',
    progress: 0,
    estimated_print_time: 0,
    estimated_material_length: 0
};

var command_set_feed_rate = {
    type: 4,
    x: [],
    y: [],
    z: [],
    e: [],
    f: [ 12000 ],
    nozzle_temp: 0,
    bed_temp: 0,
    fan_speed: 0,
    pause_time: 0,
    comment: '',
    units: 0,
    mode: 0,
    wait: false,
    custom: '',
    progress: 0,
    estimated_print_time: 0,
    estimated_material_length: 0
};


var command_set_temp_bed = {
    type: 5,
    x: [],
    y: [],
    z: [],
    e: [],
    f: [],
    nozzle_temp: 0,
    bed_temp: 60,
    fan_speed: 0,
    pause_time: 0,
    comment: '',
    units: 0,
    mode: 0,
    wait: true,
    custom: '',
    progress: 0,
    estimated_print_time: 0,
    estimated_material_length: 0
};

var command_set_temp_nozzle = {
    type: 6,
    x: [],
    y: [],
    z: [],
    e: [],
    f: [],
    nozzle_temp: 220,
    bed_temp: 0,
    fan_speed: 0,
    pause_time: 0,
    comment: '',
    units: 0,
    mode: 0,
    wait: true,
    custom: '',
    progress: 0,
    estimated_print_time: 0,
    estimated_material_length: 0
};

var command_set_fan_speed = {
    type: 7,
    x: [],
    y: [],
    z: [],
    e: [],
    f: [],
    nozzle_temp: 0,
    bed_temp: 0,
    fan_speed: 255,
    pause_time: 0,
    comment: '',
    units: 0,
    mode: 0,
    wait: false,
    custom: '',
    progress: 0,
    estimated_print_time: 0,
    estimated_material_length: 0
};

var command_set_units = {
    type: 8,
    x: [],
    y: [],
    z: [],
    e: [],
    f: [],
    nozzle_temp: 0,
    bed_temp: 0,
    fan_speed: 0,
    pause_time: 0,
    comment: '',
    units: 0,
    mode: 0,
    wait: false,
    custom: '',
    progress: 0,
    estimated_print_time: 0,
    estimated_material_length: 0
};

var command_disable_motors =  {
    type: 9,
    x: [],
    y: [],
    z: [],
    e: [],
    f: [],
    nozzle_temp: 0,
    bed_temp: 0,
    fan_speed: 0,
    pause_time: 0,
    comment: '',
    units: 0,
    mode: 0,
    wait: false,
    custom: '',
    progress: 0,
    estimated_print_time: 0,
    estimated_material_length: 0
};

var command_set_mode_xyz = {
    type: 10,
    x: [],
    y: [],
    z: [],
    e: [],
    f: [],
    nozzle_temp: 0,
    bed_temp: 0,
    fan_speed: 0,
    pause_time: 0,
    comment: '',
    units: 0,
    mode: 0,
    wait: false,
    custom: '',
    progress: 0,
    estimated_print_time: 0,
    estimated_material_length: 0
};

var command_set_mode_e = {
    type: 11,
    x: [],
    y: [],
    z: [],
    e: [],
    f: [],
    nozzle_temp: 0,
    bed_temp: 0,
    fan_speed: 0,
    pause_time: 0,
    comment: '',
    units: 0,
    mode: 0,
    wait: false,
    custom: '',
    progress: 0,
    estimated_print_time: 0,
    estimated_material_length: 0
};

var command_reset_extrusion_distance = {
    type: 12,
    x: [],
    y: [],
    z: [],
    e: [ 0 ],
    f: [],
    nozzle_temp: 0,
    bed_temp: 0,
    fan_speed: 0,
    pause_time: 0,
    comment: '',
    units: 0,
    mode: 0,
    wait: false,
    custom: '',
    progress: 0,
    estimated_print_time: 0,
    estimated_material_length: 0
};

var command_pause = {
    type: 13,
    x: [],
    y: [],
    z: [],
    e: [],
    f: [],
    nozzle_temp: 0,
    bed_temp: 0,
    fan_speed: 0,
    pause_time: 100,
    comment: '',
    units: 0,
    mode: 0,
    wait: false,
    custom: '',
    progress: 0,
    estimated_print_time: 0,
    estimated_material_length: 0
};

var command_home_axes = {
    type: 14,
    x: [ 0 ],
    y: [ 0 ],
    z: [ 0 ],
    e: [],
    f: [],
    nozzle_temp: 0,
    bed_temp: 0,
    fan_speed: 0,
    pause_time: 0,
    comment: '',
    units: 0,
    mode: 0,
    wait: false,
    custom: '',
    progress: 0,
    estimated_print_time: 0,
    estimated_material_length: 0
};

var command_home_axes_xy = {
    type: 14,
    x: [ 0 ],
    y: [ 0 ],
    z: [],
    e: [],
    f: [],
    nozzle_temp: 0,
    bed_temp: 0,
    fan_speed: 0,
    pause_time: 0,
    comment: '',
    units: 0,
    mode: 0,
    wait: false,
    custom: '',
    progress: 0,
    estimated_print_time: 0,
    estimated_material_length: 0
};

var command_home_axes_z = {
    type: 14,
    x: [],
    y: [],
    z: [ 0 ],
    e: [],
    f: [],
    nozzle_temp: 0,
    bed_temp: 0,
    fan_speed: 0,
    pause_time: 0,
    comment: '',
    units: 0,
    mode: 0,
    wait: false,
    custom: '',
    progress: 0,
    estimated_print_time: 0,
    estimated_material_length: 0
};

var command_comment = {
    type: 15,
    x: [],
    y: [],
    z: [],
    e: [],
    f: [],
    nozzle_temp: 0,
    bed_temp: 0,
    fan_speed: 0,
    pause_time: 0,
    comment: '--------------------------------',
    units: 0,
    mode: 0,
    wait: false,
    custom: '',
    progress: 0,
    estimated_print_time: 0,
    estimated_material_length: 0
};

var command_startprint = {
    type: 16,
    x: [],
    y: [],
    z: [],
    e: [],
    f: [],
    nozzle_temp: 0,
    bed_temp: 0,
    fan_speed: 0,
    pause_time: 0,
    comment: '',
    units: 0,
    mode: 0,
    wait: false,
    custom: '',
    progress: 0,
    estimated_print_time: 0,
    estimated_material_length: 0
};

var command_endprint = {
    type: 17,
    x: [],
    y: [],
    z: [],
    e: [],
    f: [],
    nozzle_temp: 0,
    bed_temp: 0,
    fan_speed: 0,
    pause_time: 0,
    comment: '',
    units: 0,
    mode: 0,
    wait: false,
    custom: '',
    progress: 0,
    estimated_print_time: 0,
    estimated_material_length: 0
};

var command_custom = {
    type: 18,
    x: [],
    y: [],
    z: [],
    e: [],
    f: [],
    nozzle_temp: 0,
    bed_temp: 0,
    fan_speed: 0,
    pause_time: 0,
    comment: '',
    units: 0,
    mode: 0,
    wait: false,
    custom: 'G867 5309',
    progress: 0,
    estimated_print_time: 0,
    estimated_material_length: 0
};

var command_progress = {
    type: 19,
    x: [],
    y: [],
    z: [],
    e: [],
    f: [],
    nozzle_temp: 0,
    bed_temp: 0,
    fan_speed: 0,
    pause_time: 0,
    comment: '',
    units: 0,
    mode: 0,
    wait: false,
    custom: '',
    progress: 0.24501,
    estimated_print_time: 0,
    estimated_material_length: 0
};

var command_estimates = {
    type: 20,
    x: [],
    y: [],
    z: [],
    e: [],
    f: [],
    nozzle_temp: 0,
    bed_temp: 0,
    fan_speed: 0,
    pause_time: 0,
    comment: '',
    units: 0,
    mode: 0,
    wait: false,
    custom: '',
    progress: 0,
    estimated_print_time: 1578.0421142578125,
    estimated_material_length: 1026.3665771484375
};
