var branchPath = "C:/Users/eaperez/workspace/vce/branches/ie11/";

var Settings = {
    rsFilesettings : {},
    branchPath : branchPath
};

Settings.rsFilesettings.settings = {
    "9999": {
        b: "",
        l: "",
        x: "9999",
        i: "/.+/",
        g: "",
        v: "",
        m: "vce_st,bsl,bsl_lf",
        c: "9999",
        w: '',
        n: '',
        s: 0,
        d: 0,
        y: 1
    },

    "8888": {
        b: "",
        l: "",
        x: "8888",
        i: "/.+/",
        g: "",
        v: "",
        m: "vce_st,bsl,bsl_lf",
        c: "8888",
        w: '',
        n: '',
        s: 0,
        d: 0,
        y: 1
    },

    "default": {
        b: "",
        l: "",
        x: "8888",
        i: "/.+/",
        g: "",
        v: "",
        m: "vce_st,bsl,bsl_lf",
        c: "8888",
        w: '',
        n: '',
        s: 0,
        d: 0,
        y: 1
    }
};

Settings.rsFilesettings.locals = ""+
  ", scorecardlocal = '/scorecardresearch.com'\n\
  , isLocalTesting =  d.URL.match(/localhost/) || d.URL.match(/office.comscore.com/)\n\
  , pixelURL     = (isLocalTesting ? scorecardlocal : bscorpfx+scorecard)+'/p?'\n\
  , RPC_SVC_URL  = (isLocalTesting ? scorecardlocal : ascorpfx+scorecard)+'/rpc.flow?'\n\
  , CODE_SVC_URL = (isLocalTesting ? scorecardlocal : bscorpfx+scorecard)+'/rs/'\n\
  , BETA_SVC_URL = (isLocalTesting ? scorecardlocal : bscorpfx+scorecard)+'/rsx/'";
  

module.exports = Settings;