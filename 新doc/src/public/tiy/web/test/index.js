/**
 * Created by Administrator on 2016/5/23.
 */
/**
 * Created by Administrator on 2015/11/26.
 */
(function ($)
{
    var MODULE_NAME = "test.index";
    var rc_info = "test_index_rc";

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString(rc_info, sRcName);
    }

    function initGrid()
    {
        var ss = getRcText("Page_info");

    }

    function initData()
    {
        $("#datetime").datetime("setDate","05/26/2016");
        $("#clocktime").datetime("setTime","14:14:56");
    }

    function initForm()
    {

    }

    function _init ()
    {
        initGrid();
        initData();
        initForm();
    }

    function _resize(jParent)
    {
    }

    function _destroy()
    {

    }
    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["SList","DateTime"],
        "utils": ["Base","Request"]
    });
}) (jQuery);

